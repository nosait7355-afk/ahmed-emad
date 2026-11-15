"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useI18n } from "@/components/providers/i18n-provider";
import { BRAND } from "@/config/brand";
import { CONTACT } from "@/config/site-content";

export function SiteFooter() {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.whatsappGreeting[locale])}`;
  const social = Object.entries(BRAND.social).filter(([, url]) => url);

  return (
    <footer className="border-t border-border/70 bg-card/40">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo size="lg" />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{BRAND.description[locale]}</p>
        </div>

        <nav className="space-y-3 text-sm" aria-label={L("روابط", "Links")}>
          <h2 className="font-semibold">{L("روابط سريعة", "Quick links")}</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#services" className="hover:text-foreground">{L("الخدمات", "Services")}</a></li>
            <li><a href="#pricing" className="hover:text-foreground">{L("الباقات", "Pricing")}</a></li>
            <li><a href="#faq" className="hover:text-foreground">{L("الأسئلة الشائعة", "FAQ")}</a></li>
            <li><Link href="/login" className="hover:text-foreground">{t.nav.login}</Link></li>
            <li><Link href="/register" className="hover:text-foreground">{L("اشترك الآن", "Subscribe")}</Link></li>
          </ul>
        </nav>

        <div className="space-y-3 text-sm">
          <h2 className="font-semibold">{L("تواصل", "Contact")}</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-foreground">
                <MessageCircle className="h-4 w-4" />
                {L("واتساب", "WhatsApp")}
              </a>
            </li>
            <li>
              <a href={`tel:+${CONTACT.whatsapp}`} className="inline-flex items-center gap-2 hover:text-foreground">
                <Phone className="h-4 w-4" />
                <span dir="ltr">{CONTACT.phone}</span>
              </a>
            </li>
            {social.map(([name, url]) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-foreground">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {locale === "ar" ? BRAND.nameAr : BRAND.name} ·{" "}
          {L("جميع الحقوق محفوظة", "All rights reserved")}
        </div>
      </div>
    </footer>
  );
}
