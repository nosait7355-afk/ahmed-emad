"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./theme-provider";
import { I18nProvider } from "./i18n-provider";
import { Toaster } from "@/components/ui/toast";
import type { Locale } from "@/lib/i18n/config";

export function Providers({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <I18nProvider initialLocale={locale}>
        {/* Every framer-motion animation respects the OS "reduce motion" setting. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        <Toaster />
      </I18nProvider>
    </ThemeProvider>
  );
}
