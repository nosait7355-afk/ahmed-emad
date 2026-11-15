import { Types } from "mongoose";
import { addMonths } from "date-fns";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth/password";
import { nextClientCode } from "@/lib/codes";
import { serialize } from "@/lib/serialize";
import { createNotification } from "./notifications";
import { findClientsByPhone, generateUsername } from "./clients";
import { normalizePhone } from "@/lib/phone";
import { getPrimaryCoachId } from "./coach-account";
import { ensureDefaultPackages, getActivePackage } from "./coaching-packages";
import type { ClientGoal, Gender } from "@/lib/constants";

/**
 * Public client sign-up (single-trainer mode).
 *
 * A visitor creates their own account and picks a package. The account is
 * attached to the primary coach and starts "pending": the client can sign in
 * but only sees the payment / waiting screen until the coach confirms the
 * payment and activates the subscription from /coach/requests.
 */

export class ClientSignupError extends Error {
  constructor(
    public code: "SIGNUP_CLOSED" | "PHONE_TAKEN" | "EMAIL_TAKEN" | "PACKAGE_UNAVAILABLE" | "NOT_FOUND",
    message: string,
  ) {
    super(message);
    this.name = "ClientSignupError";
  }
}

export interface ClientSignupInput {
  name: string;
  email?: string;
  /** Also the client's sign-in identifier. */
  phone: string;
  password: string;
  gender: Gender;
  age?: number;
  height: number;
  weight: number;
  goal: ClientGoal;
  packageId: string;
}

export async function registerClientAccount(input: ClientSignupInput): Promise<{ clientId: string; coachId: string }> {
  await connectToDatabase();
  const coachId = await getPrimaryCoachId();
  if (!coachId) {
    throw new ClientSignupError("SIGNUP_CLOSED", "التسجيل غير متاح حالياً. تواصل مع الكابتن على واتساب.");
  }
  await ensureDefaultPackages(coachId);
  const pkg = await getActivePackage(coachId, input.packageId);
  if (!pkg) {
    throw new ClientSignupError("PACKAGE_UNAVAILABLE", "الباقة المختارة غير متاحة. اختار باقة تانية.");
  }

  const phone = normalizePhone(input.phone);
  const email = input.email?.toLowerCase().trim() || undefined;
  if ((await findClientsByPhone(phone)).length > 0) {
    throw new ClientSignupError("PHONE_TAKEN", "رقم الموبايل مسجل بالفعل. سجّل دخولك بيه.");
  }
  if (email && (await User.exists({ email }))) {
    throw new ClientSignupError("EMAIL_TAKEN", "البريد الإلكتروني مستخدم بالفعل");
  }

  const client = await User.create({
    name: input.name.trim(),
    // Internal only: clients sign in with their phone number.
    username: await generateUsername(),
    email,
    phone,
    passwordHash: await hashPassword(input.password),
    role: "client",
    status: "active",
    locale: "ar",
    mustChangePassword: false,
    clientProfile: {
      coach: new Types.ObjectId(coachId),
      clientCode: await nextClientCode(),
      gender: input.gender,
      age: input.age,
      height: input.height,
      startWeight: input.weight,
      currentWeight: input.weight,
      goal: input.goal,
      active: true,
      subscriptionEndDate: null,
      signupStatus: "pending",
      signupAt: new Date(),
      requestedPackage: {
        packageId: new Types.ObjectId(pkg.id),
        name: pkg.name,
        price: pkg.price,
        months: pkg.months,
      },
    },
  });

  await createNotification({
    recipient: coachId,
    type: "new_client",
    titleAr: `طلب اشتراك جديد: ${input.name} — ${pkg.name.ar}`,
    titleEn: `New subscription request: ${input.name} — ${pkg.name.en || pkg.name.ar}`,
    link: "/coach/requests",
  });

  return { clientId: client._id.toString(), coachId };
}

export interface SignupState {
  pending: boolean;
  phone: string;
  name: string;
  package: { name: { ar: string; en: string }; price: number; months: number } | null;
}

/** The signed-in client's own sign-up state, for the waiting screen. */
export async function getSignupState(clientId: string): Promise<SignupState | null> {
  await connectToDatabase();
  if (!Types.ObjectId.isValid(clientId)) return null;
  const client = await User.findOne({ _id: clientId, role: "client" })
    .select("name phone clientProfile.signupStatus clientProfile.requestedPackage")
    .lean();
  if (!client) return null;
  const pkg = client.clientProfile?.requestedPackage;
  return {
    pending: client.clientProfile?.signupStatus === "pending",
    phone: client.phone ?? "",
    name: client.name,
    package: pkg
      ? { name: { ar: pkg.name?.ar ?? "", en: pkg.name?.en ?? "" }, price: pkg.price, months: pkg.months }
      : null,
  };
}

/** Clients waiting for payment confirmation, oldest first. */
export async function listSignupRequests(coachId: string) {
  await connectToDatabase();
  const docs = await User.find({
    role: "client",
    "clientProfile.coach": new Types.ObjectId(coachId),
    "clientProfile.signupStatus": "pending",
  })
    .select("name username email phone createdAt clientProfile")
    .sort({ "clientProfile.signupAt": 1, createdAt: 1 })
    .lean();
  return serialize(docs);
}

export async function countSignupRequests(coachId: string): Promise<number> {
  await connectToDatabase();
  if (!Types.ObjectId.isValid(coachId)) return 0;
  return User.countDocuments({
    role: "client",
    "clientProfile.coach": new Types.ObjectId(coachId),
    "clientProfile.signupStatus": "pending",
  });
}

/**
 * Confirms payment: starts the subscription today for the chosen package's
 * length (defaults to the package the client requested).
 */
export async function activateSignup(
  coachId: string,
  clientId: string,
  opts: { packageId?: string } = {},
): Promise<{ endDate: Date }> {
  await connectToDatabase();
  if (!Types.ObjectId.isValid(clientId)) throw new ClientSignupError("NOT_FOUND", "العميل غير موجود");
  const client = await User.findOne({
    _id: clientId,
    role: "client",
    "clientProfile.coach": new Types.ObjectId(coachId),
    "clientProfile.signupStatus": "pending",
  })
    .select("clientProfile.requestedPackage")
    .lean();
  if (!client) throw new ClientSignupError("NOT_FOUND", "الطلب غير موجود أو اتفعّل قبل كده");

  const requested = client.clientProfile?.requestedPackage;
  let months = requested?.months ?? 1;
  let packageSnapshot = requested;
  if (opts.packageId && opts.packageId !== String(requested?.packageId ?? "")) {
    const pkg = await getActivePackage(coachId, opts.packageId);
    if (!pkg) throw new ClientSignupError("PACKAGE_UNAVAILABLE", "الباقة المختارة غير متاحة");
    months = pkg.months;
    packageSnapshot = { packageId: new Types.ObjectId(pkg.id), name: pkg.name, price: pkg.price, months: pkg.months };
  }

  const now = new Date();
  const endDate = addMonths(now, months);
  await User.updateOne(
    { _id: clientId },
    {
      $set: {
        "clientProfile.signupStatus": "approved",
        "clientProfile.active": true,
        "clientProfile.subscriptionStartDate": now,
        "clientProfile.subscriptionEndDate": endDate,
        "clientProfile.requestedPackage": packageSnapshot,
      },
    },
  );

  await createNotification({
    recipient: clientId,
    type: "subscription_activated",
    titleAr: "تم تفعيل اشتراكك 🎉 برنامجك هيوصلك خلال ٢٤–٤٨ ساعة",
    titleEn: "Your subscription is active 🎉 Your plan arrives within 24–48 hours",
    link: "/client",
  });

  return { endDate };
}
