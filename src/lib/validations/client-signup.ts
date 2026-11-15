import { z } from "zod";
import { CLIENT_GOALS, GENDERS } from "@/lib/constants";

const usernameRegex = /^[a-zA-Z0-9_.]+$/;

/** Public sign-up form (client picks a package and creates their account). */
export const clientRegisterSchema = z
  .object({
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
      .min(8, "رقم الموبايل مطلوب")
      .max(20)
      .regex(/^\+?[0-9\s\-()]+$/, "رقم موبايل غير صالح"),
    password: z.string().min(8, "كلمة المرور 8 أحرف على الأقل").max(72),
    confirmPassword: z.string(),
    gender: z.enum(GENDERS, { errorMap: () => ({ message: "اختار النوع" }) }),
    // Optional: an empty field must stay "not provided", not coerce to 0.
    age: z.preprocess(
      (v) => (v === "" || v == null ? undefined : v),
      z.coerce.number().int().min(10, "سن غير صالح").max(90, "سن غير صالح").optional(),
    ),
    height: z.coerce
      .number({ invalid_type_error: "الطول مطلوب" })
      .min(100, "الطول بالسنتيمتر (مثلاً 175)")
      .max(250, "الطول بالسنتيمتر (مثلاً 175)"),
    weight: z.coerce
      .number({ invalid_type_error: "الوزن مطلوب" })
      .min(30, "الوزن بالكيلو (مثلاً 80)")
      .max(300, "الوزن بالكيلو (مثلاً 80)"),
    goal: z.enum(CLIENT_GOALS, { errorMap: () => ({ message: "اختار هدفك" }) }),
    packageId: z.string().min(1, "اختار باقة"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type ClientRegisterInput = z.input<typeof clientRegisterSchema>;
export type ClientRegisterData = z.output<typeof clientRegisterSchema>;

/** Coach → create / edit a coaching package. Features are one per line. */
export const packageSchema = z.object({
  nameAr: z.string().trim().min(1, "اسم الباقة مطلوب").max(60),
  nameEn: z.string().trim().max(60).default(""),
  taglineAr: z.string().trim().max(80).default(""),
  taglineEn: z.string().trim().max(80).default(""),
  months: z.coerce.number().int().min(1, "المدة شهر على الأقل").max(36, "المدة 36 شهر بحد أقصى"),
  price: z.coerce.number().min(0, "السعر غير صالح").max(1_000_000),
  originalPrice: z.coerce.number().min(0).max(1_000_000).nullable().optional(),
  featuresAr: z.string().max(2000).default(""),
  featuresEn: z.string().max(2000).default(""),
  popular: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type PackageFormInput = z.input<typeof packageSchema>;
