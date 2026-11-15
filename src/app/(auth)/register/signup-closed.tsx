"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { CONTACT } from "@/config/site-content";

/** Shown when no primary coach / no active package exists yet, so nobody can sign up. */
export function SignupClosed() {
  const { locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappGreeting[locale])}`;

  return (
    <section className="w-full max-w-sm animate-fade-in text-center">
      <header className="mb-8 space-y-3">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MessageCircle className="h-6 w-6" />
        </span>
        <h1 className="text-headline">{L("التسجيل مش متاح دلوقتي", "Sign-up isn't open yet")}</h1>
        <p className="text-muted-foreground">
          {L(
            "تقدر تتواصل مع الكابتن مباشرة على واتساب وتبدأ اشتراكك.",
            "You can message the coach directly on WhatsApp to start your subscription.",
          )}
        </p>
      </header>
      <div className="space-y-3">
        <Button asChild size="lg" className="w-full">
          <a href={wa} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            {L("تواصل على واتساب", "Message on WhatsApp")}
          </a>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href="/">{L("الرجوع للرئيسية", "Back to home")}</Link>
        </Button>
      </div>
    </section>
  );
}
