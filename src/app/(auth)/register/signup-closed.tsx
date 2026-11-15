"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/providers/i18n-provider";
import { CONTACT } from "@/config/site-content";

/** Shown when no primary coach / no active package exists yet, so nobody can sign up. */
export function SignupClosed() {
  const { locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappGreeting[locale])}`;

  return (
    <Card className="animate-fade-in text-center">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">{L("التسجيل مش متاح دلوقتي", "Sign-up isn't open yet")}</CardTitle>
        <CardDescription>
          {L(
            "تقدر تتواصل مع الكابتن مباشرة على واتساب وتبدأ اشتراكك.",
            "You can message the coach directly on WhatsApp to start your subscription.",
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild size="lg" className="w-full">
          <a href={wa} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            {L("تواصل على واتساب", "Message on WhatsApp")}
          </a>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href="/">{L("الرجوع للرئيسية", "Back to home")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
