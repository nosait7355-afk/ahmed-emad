import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { comparePassword } from "./password";
import { accountCanLogin } from "@/lib/permissions";
import { loginSchema } from "@/lib/validations/auth";
import { syncCoachStatus } from "@/lib/services/subscription";
import { logError } from "@/lib/logging/error-log";
import {
  peekRateLimit,
  recordRateLimitHit,
  resetRateLimit,
  RATE_LIMITS,
} from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/request-context";
import { CredentialsSignin } from "next-auth";

/**
 * Distinguishable sign-in failures. `code` reaches the login form as
 * `signIn(...).code`, so the user sees why they were rejected instead of a
 * blanket "wrong password" — the previous behaviour made a rate-limit lockout
 * indistinguishable from a genuinely wrong password.
 */
class LoginRateLimited extends CredentialsSignin {
  code = "rate_limited";
}

class AccountSuspended extends CredentialsSignin {
  code = "account_suspended";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { identifier, password } = parsed.data;

        // Brute-force guard, keyed by IP + identifier so one attacker can't
        // burn through many accounts, nor one account be hammered from many
        // IPs. Only FAILED attempts count: peek here, record below on failure,
        // and clear on success. Counting every attempt (as this used to) meant
        // a user who signed in and out a few times, or mistyped their password
        // a few times, was then rejected for 15 minutes with the exact same
        // "invalid credentials" message even when the password was correct.
        const ip = await getClientIp();
        const id = identifier.toLowerCase().trim();
        const ipKey = `ip:${ip}`;
        const idKey = `id:${id}`;
        if (!peekRateLimit(RATE_LIMITS.loginIp, ipKey).ok) throw new LoginRateLimited();
        if (!peekRateLimit(RATE_LIMITS.login, idKey).ok) throw new LoginRateLimited();

        const fail = () => {
          recordRateLimitHit(RATE_LIMITS.loginIp, ipKey);
          recordRateLimitHit(RATE_LIMITS.login, idKey);
          return null;
        };

        try {
          await connectToDatabase();
          const user = await User.findOne({
            $or: [{ username: id }, { email: id }],
          });
          if (!user) return fail();

          const ok = await comparePassword(password, user.passwordHash);
          if (!ok) return fail();

          // Password was right — don't hold a lockout over a legitimate user.
          resetRateLimit(RATE_LIMITS.loginIp, ipKey);
          resetRateLimit(RATE_LIMITS.login, idKey);

          // Suspended accounts cannot sign in. Expired coaches CAN (read-only).
          if (!accountCanLogin(user.status)) throw new AccountSuspended();

          // Best-effort last-login stamp.
          user.lastLoginAt = new Date();
          await user.save().catch(() => {});

          // Coaches: lapsed trial/subscription dates flip status to "expired" here.
          const effectiveStatus =
            user.role === "coach"
              ? await syncCoachStatus(user._id.toString()).catch(() => user.status)
              : user.status;

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email ?? undefined,
            username: user.username,
            role: user.role,
            status: effectiveStatus,
            locale: user.locale,
            mustChangePassword: user.mustChangePassword,
            sessionVersion: user.sessionVersion ?? 0,
          };
        } catch (error) {
          // Deliberate, already-classified rejections pass straight through so
          // the form can show their specific message.
          if (error instanceof CredentialsSignin) throw error;
          // Unexpected failure (DB down, etc.) — NOT a normal wrong-password
          // rejection, so this is worth recording. Still return null so the
          // login form just shows "invalid credentials" as before.
          await logError({
            type: "AUTH_ERROR",
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            email: identifier,
            route: "/login",
            action: "authorize",
          });
          return null;
        }
      },
    }),
  ],
});
