"use server";

import { revalidatePath } from "next/cache";
import { getCoachAreaWriteCtxFor } from "./guards";
import { runAction, ok, fail, type ActionResult } from "./result";
import { canManageClients, canManageSubscriptions } from "@/lib/permissions/team";
import { activateSignup, ClientSignupError } from "@/lib/services/client-signup";
import { deleteClient } from "@/lib/services/clients";
import {
  createPackage,
  deletePackage,
  movePackage,
  updatePackage,
} from "@/lib/services/coaching-packages";
import { packageSchema, type PackageFormInput } from "@/lib/validations/client-signup";

/* ---- Sign-up requests ---- */

/** Coach confirmed the payment: start the client's subscription. */
export async function activateSignupAction(
  clientId: string,
  packageId?: string,
): Promise<ActionResult<{ endDate: string }>> {
  return runAction(async () => {
    const ctx = await getCoachAreaWriteCtxFor(canManageClients);
    try {
      const { endDate } = await activateSignup(ctx.coachId, clientId, { packageId });
      revalidatePath("/coach/requests");
      revalidatePath("/coach/clients");
      revalidatePath("/coach");
      return ok({ endDate: endDate.toISOString() });
    } catch (e) {
      if (e instanceof ClientSignupError) return fail(e.message, e.code);
      throw e;
    }
  });
}

/** Coach declined the request: removes the pending account entirely. */
export async function rejectSignupAction(clientId: string): Promise<ActionResult> {
  return runAction(async () => {
    const ctx = await getCoachAreaWriteCtxFor(canManageClients);
    const removed = await deleteClient(ctx.coachId, clientId);
    if (!removed) return fail("الطلب غير موجود", "NOT_FOUND");
    revalidatePath("/coach/requests");
    return ok();
  });
}

/* ---- Coaching packages ---- */

function revalidatePackages() {
  revalidatePath("/coach/packages");
  revalidatePath("/register");
  revalidatePath("/");
}

export async function savePackageAction(
  packageId: string | null,
  input: PackageFormInput,
): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    const ctx = await getCoachAreaWriteCtxFor(canManageSubscriptions);
    const parsed = packageSchema.safeParse(input);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return fail(issue?.message ?? "بيانات غير صالحة", "VALIDATION", issue?.path[0] as string | undefined);
    }
    const data = parsed.data;
    const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
    const payload = {
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      taglineAr: data.taglineAr,
      taglineEn: data.taglineEn,
      months: data.months,
      price: data.price,
      originalPrice: data.originalPrice ?? null,
      featuresAr: lines(data.featuresAr),
      featuresEn: lines(data.featuresEn),
      popular: data.popular,
      isActive: data.isActive,
    };
    let id = packageId;
    if (packageId) {
      if (!(await updatePackage(ctx.coachId, packageId, payload))) return fail("الباقة غير موجودة", "NOT_FOUND");
    } else {
      id = await createPackage(ctx.coachId, payload);
    }
    revalidatePackages();
    return ok({ id: id! });
  });
}

export async function deletePackageAction(packageId: string): Promise<ActionResult> {
  return runAction(async () => {
    const ctx = await getCoachAreaWriteCtxFor(canManageSubscriptions);
    if (!(await deletePackage(ctx.coachId, packageId))) return fail("الباقة غير موجودة", "NOT_FOUND");
    revalidatePackages();
    return ok();
  });
}

export async function movePackageAction(packageId: string, direction: -1 | 1): Promise<ActionResult> {
  return runAction(async () => {
    const ctx = await getCoachAreaWriteCtxFor(canManageSubscriptions);
    await movePackage(ctx.coachId, packageId, direction);
    revalidatePackages();
    return ok();
  });
}
