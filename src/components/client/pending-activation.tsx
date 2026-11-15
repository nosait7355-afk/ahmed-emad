"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Check, Copy, LogOut, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/brand/language-switcher";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Logo } from "@/components/brand/logo";
import { useI18n } from "@/components/providers/i18n-provider";
import { BRAND } from "@/config/brand";
import { CONTACT } from "@/config/site-content";
import { formatNumber } from "@/lib/utils";

/**
 * Full-screen "one step left" page for a self-registered client whose
 * subscription the coach has not activated yet: how to pay, a WhatsApp
 * hand-off, and what happens next. Re-checks periodically so the app opens
 * by itself once the coach activates the account.
 */
export function PendingActivation({
  name,
  username,
  pkg,
}: {
  name: string;
  username: string;
  pkg: { name: { ar: string; en: string }; price: number; months: number } | null;
}) {
  const { locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  // Pick up the activation without the client having to reload.
  useEffect(() => {
    const id = setInterval(() => router.refresh(), 30_000);
    return () => clearInterval(id);
  }, [router]);

  const firstName = name.trim().split(/\s+/)[0] ?? name;
  const pkgName = pkg ? pkg.name[locale] || pkg.name.ar : "";
  const price = pkg ? formatNumber(pkg.price, locale) : "";

  const message = pkg
    ? L(
        `مرحبا كابتن، أنا ${name} سجلت على الموقع (اسم المستخدم: ${username}) واخترت باقة «${pkg.name.ar}» بسعر ${pkg.price} ج.م. دي صورة التحويل.`,
        `Hi coach, I'm ${name}. I signed up on the site (username: ${username}) and chose the "${pkg.name.en || pkg.name.ar}" plan for ${pkg.price} EGP. Here is my transfer screenshot.`,
      )
    : L(
        `مرحبا كابتن، أنا ${name} سجلت على الموقع (اسم المستخدم: ${username}) وعايز أفعّل اشتراكي.`,
        `Hi coach, I'm ${name}. I signed up on the site (username: ${username}) and would like to activate my subscription.`,
      );
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(CONTACT.instapay);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the number is visible to type manually */
    }
  }

  function recheck() {
    setChecking(true);
    router.refresh();
    setTimeout(() => setChecking(false), 1200);
  }

  const steps = [
    {
      title: L("حوّل قيمة الباقة على إنستاباي", "Send the plan price by InstaPay"),
      body: (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-xl bg-muted/70 px-3.5 py-2.5">
          <div>
            <div className="text-xs text-muted-foreground">{L("رقم إنستاباي", "InstaPay number")}</div>
            <div className="font-mono text-lg font-semibold tracking-wide" dir="ltr">
              {CONTACT.instapay}
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={copyNumber}>
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            {copied ? L("اتنسخ", "Copied") : L("نسخ", "Copy")}
          </Button>
        </div>
      ),
    },
    {
      title: L("ابعت صورة التحويل للكابتن على واتساب", "Send the transfer screenshot to the coach on WhatsApp"),
      body: (
        <p className="mt-1 text-sm text-muted-foreground">
          {L("الرسالة هتتكتب لوحدها ببياناتك — ضيف عليها الصورة بس.", "The message is pre-filled with your details — just attach the screenshot.")}
        </p>
      ),
    },
    {
      title: L("الكابتن يأكد الدفع ويفعّل اشتراكك", "The coach confirms the payment and activates you"),
      body: (
        <p className="mt-1 text-sm text-muted-foreground">
          {L("برنامجك الكامل بيوصلك خلال ٢٤–٤٨ ساعة من التأكيد.", "Your full plan arrives within 24–48 hours of confirmation.")}
        </p>
      ),
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.10),transparent)]"
        aria-hidden
      />
      <header className="flex items-center justify-between p-4">
        <Logo href={null} />
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-10 pt-4">
        <div className="animate-fade-in text-center">
          <Image
            src={BRAND.images.avatar}
            alt={BRAND.name}
            width={88}
            height={88}
            className="mx-auto rounded-full ring-4 ring-background"
            priority
          />
          <h1 className="mt-5 text-2xl font-bold">
            {L(`حسابك جاهز يا ${firstName} 👋`, `Your account is ready, ${firstName} 👋`)}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {L("فاضل خطوة الدفع وبعدها اشتراكك يتفعّل.", "One payment step left and your subscription goes live.")}
          </p>
        </div>

        {pkg && (
          <Card className="mt-6">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <div className="text-xs text-muted-foreground">{L("الباقة اللي اخترتها", "Your plan")}</div>
                <div className="text-lg font-semibold">{pkgName}</div>
              </div>
              <div className="text-end">
                <div className="text-2xl font-bold tabular-nums">{price}</div>
                <div className="text-xs text-muted-foreground">{L("ج.م", "EGP")}</div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-4">
          <CardContent className="p-5">
            <ol className="space-y-5">
              {steps.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {formatNumber(i + 1, locale)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium leading-7">{s.title}</div>
                    {s.body}
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="mt-6 space-y-3">
          <Button asChild size="lg" className="w-full">
            <a href={wa} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              {L("ابعت صورة التحويل على واتساب", "Send the screenshot on WhatsApp")}
            </a>
          </Button>
          <Button type="button" variant="outline" size="lg" className="w-full" onClick={recheck} disabled={checking}>
            <RefreshCw className={checking ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            {L("دفعت؟ حدّث الحالة", "Paid? Refresh status")}
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {L("الصفحة دي هتفتح التطبيق لوحدها أول ما الاشتراك يتفعّل.", "This page opens the app by itself as soon as you're activated.")}
        </p>

        <div className="mt-4 flex justify-center">
          <Button type="button" variant="ghost" size="sm" onClick={() => signOut({ redirectTo: "/" })}>
            <LogOut className="h-4 w-4" />
            {L("تسجيل الخروج", "Sign out")}
          </Button>
        </div>
      </main>
    </div>
  );
}
