/**
 * Phone helpers for client sign-in. Clients sign in with the phone number
 * they were registered with, typed in any common form (01012345678,
 * +201012345678, 00201012345678), so numbers are compared by their tail.
 */

const PHONE_LIKE = /^\+?[0-9\s\-()]{7,20}$/;
const TAIL_LENGTH = 10;

/** Thrown when a client phone number is already used by another client. */
export class PhoneTakenError extends Error {
  code = "PHONE_TAKEN" as const;
  constructor() {
    super("رقم الموبايل مسجل لعميل آخر");
    this.name = "PhoneTakenError";
  }
}

/** Storage form: an optional leading + followed by digits only. */
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[^0-9]/g, "");
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

/** True when a login identifier should also be tried as a phone number. */
export function looksLikePhone(raw: string): boolean {
  return PHONE_LIKE.test(raw.trim());
}

/**
 * The significant tail of a number: digits only, leading zeros dropped, last
 * 10 digits. Returns null when too short to identify a number safely.
 */
export function phoneTail(raw: string): string | null {
  const digits = raw.replace(/[^0-9]/g, "").replace(/^0+/, "");
  if (digits.length < 7) return null;
  return digits.slice(-TAIL_LENGTH);
}

/** Regex matching any stored phone ending with the given tail, ignoring separators. */
export function phoneTailRegex(tail: string): RegExp {
  return new RegExp(`${tail.split("").join("[^0-9]*")}[^0-9]*$`);
}
