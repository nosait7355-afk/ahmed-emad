import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { getLocale } from "@/lib/i18n/server";
import { dirForLocale } from "@/lib/i18n/config";
import { APP_URL } from "@/lib/app-url";
import { BRAND } from "@/config/brand";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.nameAr} — ${BRAND.tagline.ar}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description.ar,
  applicationName: BRAND.name,
  keywords: [
    BRAND.name,
    BRAND.nameAr,
    "مدرب شخصي",
    "تدريب شخصي",
    "أونلاين كوتشينج",
    "online coaching",
    "personal trainer",
    "نظام غذائي",
    "برنامج تمارين",
  ],
  authors: [{ name: BRAND.name }],
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: `${BRAND.nameAr} — ${BRAND.tagline.ar}`,
    description: BRAND.description.ar,
    siteName: BRAND.name,
    type: "website",
    images: [{ url: BRAND.images.og, width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.nameAr} — ${BRAND.tagline.ar}`,
    description: BRAND.description.ar,
    images: [BRAND.images.og],
  },
  icons: {
    icon: "/icon.png",
    shortcut: BRAND.images.favicon,
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F7F9" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dir = dirForLocale(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${arabic.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
