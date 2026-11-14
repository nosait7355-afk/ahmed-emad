import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Settings } from "@/models/Settings";
import { hashPassword } from "@/lib/auth/password";

/**
 * Single-trainer mode.
 *
 * The site belongs to one trainer. Coach accounts are created only by the
 * super admin, never self-registered, and they never expire: no trial, no
 * subscription end date, no client or team limits. The super admin can still
 * suspend or block a coach from the coaches page.
 *
 * One coach is the "primary coach": every client who signs up from the public
 * site is attached to them.
 */

export class CoachAccountError extends Error {
  constructor(
    public code: "USERNAME_TAKEN" | "EMAIL_TAKEN" | "NOT_FOUND",
    message: string,
  ) {
    super(message);
    this.name = "CoachAccountError";
  }
}

export interface CreateCoachInput {
  name: string;
  username: string;
  email?: string;
  phone?: string;
  password: string;
  whatsappNumber?: string;
}

/** Fields that make a coach account permanent and unlimited. */
function unlimitedCoachProfile() {
  return {
    subscriptionStatus: "active" as const,
    subscriptionStartDate: new Date(),
    subscriptionEndDate: null,
    currentPlan: null,
    // 0 = unlimited clients (see assertClientLimit); undefined = unlimited team members.
    maxClients: 0,
    maxTeamMembers: undefined,
    suspendedByAdmin: false,
  };
}

/** Creates a permanent coach account. Becomes the primary coach if none is set yet. */
export async function createCoachAccount(input: CreateCoachInput): Promise<{ coachId: string; isPrimary: boolean }> {
  await connectToDatabase();
  const username = input.username.toLowerCase().trim();
  const email = input.email?.toLowerCase().trim() || undefined;

  if (await User.exists({ username })) {
    throw new CoachAccountError("USERNAME_TAKEN", "اسم المستخدم مستخدم بالفعل");
  }
  if (email && (await User.exists({ email }))) {
    throw new CoachAccountError("EMAIL_TAKEN", "البريد الإلكتروني مستخدم بالفعل");
  }

  const coach = await User.create({
    name: input.name.trim(),
    username,
    email,
    phone: input.phone?.trim() || undefined,
    passwordHash: await hashPassword(input.password),
    role: "coach",
    status: "active",
    locale: "ar",
    mustChangePassword: false,
    coachProfile: {
      whatsappNumber: input.whatsappNumber?.trim() || undefined,
      ...unlimitedCoachProfile(),
    },
  });

  const coachId = coach._id.toString();
  const isPrimary = !(await getPrimaryCoachId());
  if (isPrimary) await setPrimaryCoach(coachId);
  return { coachId, isPrimary };
}

/**
 * Converts an existing coach (e.g. one created through the old trial sign-up)
 * into a permanent, unlimited account and lifts any admin suspension.
 */
export async function makeCoachPermanent(coachId: string): Promise<void> {
  await connectToDatabase();
  const res = await User.updateOne(
    { _id: coachId, role: "coach" },
    {
      $set: {
        status: "active",
        "coachProfile.subscriptionStatus": "active",
        "coachProfile.subscriptionEndDate": null,
        "coachProfile.maxClients": 0,
        "coachProfile.suspendedByAdmin": false,
      },
      $unset: {
        "coachProfile.trialEndDate": "",
        "coachProfile.maxTeamMembers": "",
        "coachProfile.preSuspendStatus": "",
      },
    },
  );
  if (res.matchedCount === 0) throw new CoachAccountError("NOT_FOUND", "المدرب غير موجود");
}

/** The coach every public sign-up is attached to, or null if not configured yet. */
export async function getPrimaryCoachId(): Promise<string | null> {
  await connectToDatabase();
  const settings = await Settings.findOne({ key: "global" }).select("primaryCoach").lean();
  const id = settings?.primaryCoach ? String(settings.primaryCoach) : null;
  if (!id) return null;
  // Guard against a deleted coach still being referenced.
  return (await User.exists({ _id: id, role: "coach" })) ? id : null;
}

export async function setPrimaryCoach(coachId: string): Promise<void> {
  await connectToDatabase();
  if (!Types.ObjectId.isValid(coachId) || !(await User.exists({ _id: coachId, role: "coach" }))) {
    throw new CoachAccountError("NOT_FOUND", "المدرب غير موجود");
  }
  await Settings.updateOne(
    { key: "global" },
    { $set: { primaryCoach: new Types.ObjectId(coachId) } },
    { upsert: true },
  );
}
