import { z } from "zod";

const usernameRegex = /^[a-zA-Z0-9_.]+$/;

export const loginSchema = z.object({
  identifier: z.string().min(3, "أدخل اسم المستخدم أو البريد الإلكتروني"),
  password: z.string().min(1, "أدخل كلمة المرور"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/** Super admin → create a permanent coach account. */
export const adminCreateCoachSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب").max(80),
  username: z
    .string()
    .trim()
    .min(3, "اسم المستخدم 3 أحرف على الأقل")
    .max(30)
    .regex(usernameRegex, "أحرف إنجليزية وأرقام و _ . فقط"),
  email: z.string().trim().email("بريد إلكتروني غير صالح").optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, "رقم هاتف غير صالح")
    .optional()
    .or(z.literal("")),
  password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل").max(72),
});

export type AdminCreateCoachInput = z.infer<typeof adminCreateCoachSchema>;
