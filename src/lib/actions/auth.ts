"use server";

import { clientRegisterSchema, type ClientRegisterInput } from "@/lib/validations/client-signup";
import { registerClientAccount, ClientSignupError } from "@/lib/services/client-signup";
import { getLocale } from "@/lib/i18n/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { logError } from "@/lib/logging/error-log";
import { rateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/request-context";

export type RegisterResult =
  | { ok: true }
  | {
      ok: false;
      error:
        | "PHONE_TAKEN"
        | "EMAIL_TAKEN"
        | "VALIDATION"
        | "SERVER"
        | "RATE_LIMITED"
        | "SIGNUP_CLOSED"
        | "PACKAGE_UNAVAILABLE";
      field?: string;
      message?: string;
    };

/**
 * Public client sign-up (single-trainer mode). Creates a pending client
 * attached to the primary coach; the coach activates it after payment.
 *
 * Coach accounts can no longer self-register — the super admin creates them.
 */
export async function registerClient(input: ClientRegisterInput): Promise<RegisterResult> {
  // Rate limit account creation per IP (3 / hour) to curb spam sign-ups.
  const ip = await getClientIp();
  if (!rateLimit(RATE_LIMITS.register, ip).ok) {
    return { ok: false, error: "RATE_LIMITED" };
  }

  const parsed = clientRegisterSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: "VALIDATION", field: issue?.path[0] as string | undefined, message: issue?.message };
  }
  const data = parsed.data;

  try {
    const { clientId } = await registerClientAccount({
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      password: data.password,
      gender: data.gender,
      age: data.age,
      height: data.height,
      weight: data.weight,
      goal: data.goal,
      packageId: data.packageId,
    });
    const locale = await getLocale();
    if (locale !== "ar") {
      await connectToDatabase();
      await User.updateOne({ _id: clientId }, { $set: { locale } });
    }
  } catch (e: unknown) {
    if (e instanceof ClientSignupError) {
      const field = e.code === "PHONE_TAKEN" ? "phone" : e.code === "EMAIL_TAKEN" ? "email" : undefined;
      return { ok: false, error: e.code === "NOT_FOUND" ? "SERVER" : e.code, field, message: e.message };
    }
    const err = e as { code?: number; keyPattern?: Record<string, unknown> };
    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern ?? {})[0];
      // A non-email duplicate can only be the generated internal username: retryable server error.
      return field === "email" ? { ok: false, error: "EMAIL_TAKEN", field } : { ok: false, error: "SERVER" };
    }
    const error = e instanceof Error ? e : new Error(String(e));
    await logError({
      type: "AUTH_ERROR",
      message: error.message,
      stack: error.stack,
      email: data.email || undefined,
      route: "/register",
      action: "registerClient",
    });
    return { ok: false, error: "SERVER" };
  }

  return { ok: true };
}
