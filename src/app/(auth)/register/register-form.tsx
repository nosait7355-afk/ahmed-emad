"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/components/providers/i18n-provider";
import { clientRegisterSchema, type ClientRegisterData } from "@/lib/validations/client-signup";
import { registerClient } from "@/lib/actions/auth";
import { ARAB_COUNTRIES, CLIENT_GOALS, GENDERS } from "@/lib/constants";
import { GENDER_LABELS, GOAL_LABELS } from "@/lib/i18n/labels";
import { cn, formatNumber } from "@/lib/utils";
import type { PackageDTO } from "@/lib/services/coaching-packages";

export function RegisterForm({
  packages,
  preselectedPackageId,
}: {
  packages: PackageDTO[];
  preselectedPackageId?: string;
}) {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [country, setCountry] = useState<string>(ARAB_COUNTRIES[0].value);
  const [nationalPhone, setNationalPhone] = useState("");
  const dialCode = ARAB_COUNTRIES.find((c) => c.value === country)?.dialCode ?? "+20";

  const initialPackage =
    packages.find((p) => p.id === preselectedPackageId)?.id ??
    packages.find((p) => p.popular)?.id ??
    packages[0]?.id ??
    "";

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClientRegisterData>({
    resolver: zodResolver(clientRegisterSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      packageId: initialPackage,
    },
  });

  const packageId = watch("packageId");
  const gender = watch("gender");
  const goal = watch("goal");
  const selected = packages.find((p) => p.id === packageId);

  useEffect(() => {
    // Drop a leading 0 from the local number so +20 010… becomes +2010….
    const local = nationalPhone.replace(/[^0-9]/g, "").replace(/^0+/, "");
    setValue("phone", local ? `${dialCode}${local}` : "", { shouldValidate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialCode, nationalPhone]);

  async function onSubmit(values: ClientRegisterData) {
    setServerError(null);
    const res = await registerClient(values);

    if (!res.ok) {
      if (res.error === "USERNAME_TAKEN") {
        setError("username", { message: t.auth.usernameTaken });
      } else if (res.error === "EMAIL_TAKEN") {
        setError("email", { message: t.auth.emailTaken });
      } else if (res.error === "RATE_LIMITED") {
        setServerError(
          L("محاولات تسجيل كتير من نفس الجهاز. جرّب تاني بعد ساعة.", "Too many sign-ups from this device. Please try again in an hour."),
        );
      } else if (res.error === "SIGNUP_CLOSED" || res.error === "PACKAGE_UNAVAILABLE" || res.error === "VALIDATION") {
        setServerError(res.message ?? t.common.errorDescription);
        if (res.error === "PACKAGE_UNAVAILABLE") router.refresh();
      } else {
        setServerError(t.common.errorDescription);
      }
      return;
    }

    // Sign in straight away; the client area shows the payment / waiting screen.
    const signInRes = await signIn("credentials", {
      redirect: false,
      identifier: values.username,
      password: values.password,
    });
    if (!signInRes || signInRes.error) {
      router.push("/login");
      return;
    }
    router.push("/client");
    router.refresh();
  }

  const err = (key: keyof ClientRegisterData) =>
    errors[key] ? <p className="text-sm text-destructive">{errors[key]?.message as string}</p> : null;

  return (
    <section className="w-full max-w-xl animate-fade-in">
      <header className="mb-8 space-y-2">
        <h1 className="text-headline">{t.auth.registerTitle}</h1>
        <p className="text-muted-foreground">{t.auth.registerSubtitle}</p>
      </header>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* 1 — Package */}
          <fieldset className={SECTION}>
            <Legend n={L("١", "1")}>{L("اختار باقتك", "Choose your plan")}</Legend>
            <input type="hidden" {...register("packageId")} />
            <div role="radiogroup" aria-label={L("الباقات", "Plans")} className="grid gap-2 sm:grid-cols-2">
              {packages.map((p) => {
                const active = p.id === packageId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setValue("packageId", p.id, { shouldValidate: true })}
                    className={cn(
                      "press flex w-full items-center gap-3 rounded-2xl border p-3.5 text-start transition-colors",
                      active
                        ? "border-primary bg-primary/[0.06] ring-4 ring-primary/10"
                        : "border-transparent bg-muted/60 hover:bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
                      )}
                    >
                      {active && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{p.name[locale] || p.name.ar}</span>
                        {p.popular && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                            {L("الأكثر اختياراً", "Most chosen")}
                          </span>
                        )}
                      </span>
                      {(p.tagline[locale] || p.tagline.ar) && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {p.tagline[locale] || p.tagline.ar}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-end">
                      {p.originalPrice && (
                        <span className="block text-xs text-muted-foreground line-through">
                          {formatNumber(p.originalPrice, locale)}
                        </span>
                      )}
                      <span className="block font-bold tabular-nums">
                        {formatNumber(p.price, locale)}{" "}
                        <span className="text-xs font-medium text-muted-foreground">{L("ج.م", "EGP")}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            {err("packageId")}
            {selected && selected.features.length > 0 && (
              <ul className="space-y-1.5 px-1 pt-1 text-sm">
                {selected.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f[locale] || f.ar}</span>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>

          {/* 2 — About you */}
          <fieldset className={SECTION}>
            <Legend n={L("٢", "2")}>{L("بياناتك", "About you")}</Legend>

            <div className="space-y-2">
              <Label htmlFor="name">{t.auth.fullName}</Label>
              <Input id="name" autoComplete="name" {...register("name")} />
              {err("name")}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{L("رقم الموبايل (واتساب)", "Mobile number (WhatsApp)")}</Label>
              <input type="hidden" {...register("phone")} />
              <div className="flex gap-2" dir="ltr">
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="w-28 shrink-0" aria-label={L("الدولة", "Country")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ARAB_COUNTRIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.flag} {c.dialCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  dir="ltr"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="1012345678"
                  value={nationalPhone}
                  onChange={(e) => setNationalPhone(e.target.value)}
                  className="flex-1"
                />
              </div>
              {err("phone")}
            </div>

            <div className="space-y-2">
              <Label>{L("النوع", "Gender")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {GENDERS.map((g) => (
                  <Choice key={g} active={gender === g} onClick={() => setValue("gender", g, { shouldValidate: true })}>
                    {GENDER_LABELS[g][locale]}
                  </Choice>
                ))}
              </div>
              {err("gender")}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="age">{L("السن", "Age")}</Label>
                <Input id="age" dir="ltr" inputMode="numeric" {...register("age")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">{L("الطول (سم)", "Height (cm)")}</Label>
                <Input id="height" dir="ltr" inputMode="decimal" {...register("height")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">{L("الوزن (كجم)", "Weight (kg)")}</Label>
                <Input id="weight" dir="ltr" inputMode="decimal" {...register("weight")} />
              </div>
            </div>
            {err("age") ?? err("height") ?? err("weight")}

            <div className="space-y-2">
              <Label>{L("هدفك", "Your goal")}</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {CLIENT_GOALS.map((g) => (
                  <Choice key={g} active={goal === g} onClick={() => setValue("goal", g, { shouldValidate: true })}>
                    {GOAL_LABELS[g][locale]}
                  </Choice>
                ))}
              </div>
              {err("goal")}
            </div>
          </fieldset>

          {/* 3 — Account */}
          <fieldset className={SECTION}>
            <Legend n={L("٣", "3")}>{L("بيانات الدخول", "Sign-in details")}</Legend>

            <div className="space-y-2">
              <Label htmlFor="username">{t.common.username}</Label>
              <Input id="username" dir="ltr" autoComplete="username" autoCapitalize="none" {...register("username")} />
              {err("username")}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                {t.common.email}{" "}
                <span className="text-xs text-muted-foreground">({t.common.optional})</span>
              </Label>
              <Input id="email" type="email" dir="ltr" autoComplete="email" {...register("email")} />
              {err("email")}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">{t.common.password}</Label>
                <Input id="password" type="password" dir="ltr" autoComplete="new-password" {...register("password")} />
                {err("password")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.auth.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  dir="ltr"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
                {err("confirmPassword")}
              </div>
            </div>
          </fieldset>

          {serverError && (
            <div role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          {/* Sticky on mobile so the price and submit stay in reach of the thumb. */}
          <div className="glass sticky bottom-0 -mx-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:static sm:mx-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {selected
              ? L(
                  `سجّل وكمّل للدفع — ${formatNumber(selected.price, locale)} ج.م`,
                  `Sign up & continue to payment — ${formatNumber(selected.price, locale)} EGP`,
                )
              : t.auth.registerButton}
          </Button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t.auth.haveAccount}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t.auth.signIn}
          </Link>
        </p>
      </div>
    </section>
  );
}

const SECTION = "space-y-4 rounded-3xl bg-card p-4 shadow-soft sm:p-5";

/** Numbered section heading for the sign-up steps. */
function Legend({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <legend className="flex items-center gap-2.5 pb-1 text-base font-semibold">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
        {n}
      </span>
      {children}
    </legend>
  );
}

/** Pill toggle used for single-choice groups (gender, goal). */
function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "press h-11 rounded-[14px] border px-3 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary/[0.08] text-primary"
          : "border-transparent bg-muted/70 text-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
