"use client";

import Image from "next/image";
import { BRAND } from "@/config/brand";
import { useI18n } from "@/components/providers/i18n-provider";

/**
 * Trainer portrait panel for the auth screens: a short banner on mobile,
 * a full-height sticky column on large screens.
 */
export function AuthHero() {
  const { locale } = useI18n();

  return (
    <div className="relative h-[38svh] min-h-[260px] w-full overflow-hidden lg:sticky lg:top-0 lg:h-svh lg:min-h-0">
      <Image
        src={BRAND.images.portrait}
        alt={locale === "ar" ? BRAND.nameAr : BRAND.name}
        fill
        priority
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="object-cover object-top"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-6 pb-12 text-white lg:p-12">
        <p className="text-eyebrow text-white/70">{BRAND.tagline[locale]}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight lg:text-5xl">
          {locale === "ar" ? BRAND.nameAr : BRAND.name}
        </p>
        <p className="mt-3 hidden max-w-md text-base leading-relaxed text-white/75 lg:block">
          {BRAND.description[locale]}
        </p>
      </div>
    </div>
  );
}
