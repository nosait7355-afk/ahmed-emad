"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, AlertTriangle } from "lucide-react";
import { BrandText } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/brand/language-switcher";
import { ThemeToggle } from "@/components/brand/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";
import { NotificationsMenu, type NotificationItem } from "./notifications-menu";
import { PushRegistrar } from "@/components/notifications/push-registrar";
import { MobileTabBar } from "./mobile-tab-bar";
import { cn } from "@/lib/utils";
import { getNavForRole } from "./nav-config";
import { useI18n } from "@/components/providers/i18n-provider";
import { useBrand } from "@/components/providers/brand-provider";
import { coachIsReadOnly } from "@/lib/permissions";
import type { AccountStatus, UserRole } from "@/lib/constants";
import type { TeamPermissionContext } from "@/lib/permissions/team";

/** Brand-aware sidebar/sheet logo: shows the coach's custom logo + academy name when configured, else the site wordmark. */
function BrandLogo() {
  const brand = useBrand();
  return (
    <Link href="/" className="inline-flex items-center gap-2" aria-label={brand.academyName}>
      {brand.logo ? (
        <Image src={brand.logo} alt={brand.academyName} width={36} height={36} className="shrink-0 rounded object-contain" />
      ) : (
        <Image src="/brand/logo.webp" alt={brand.academyName} width={36} height={36} className="shrink-0 rounded-full" priority />
      )}
      {brand.logo ? (
        <span className="text-lg font-bold tracking-tight">{brand.academyName}</span>
      ) : (
        <BrandText className="text-lg" />
      )}
    </Link>
  );
}

export function DashboardShell({
  role,
  name,
  subtitle,
  status,
  avatarUrl,
  notifications = [],
  unread = 0,
  featureFlags,
  children,
}: {
  role: UserRole;
  name: string;
  subtitle?: string;
  status: AccountStatus;
  avatarUrl?: string;
  notifications?: NotificationItem[];
  unread?: number;
  featureFlags?: { branding?: boolean; teamCtx?: TeamPermissionContext };
  children: React.ReactNode;
}) {
  const { t, dir } = useI18n();
  const brand = useBrand();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sections = getNavForRole(role, t, featureFlags);
  const mobileSide = dir === "rtl" ? "right" : "left";
  const showReadOnly = (role === "coach" || role === "team_member") && coachIsReadOnly(status);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar — uses the design tokens, not per-coach colors. */}
      <aside className="sticky top-0 hidden h-screen w-[17rem] shrink-0 flex-col border-e border-border/60 bg-card/60 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center px-5">
          <BrandLogo />
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
          <SidebarNav sections={sections} />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass hairline-b sticky top-0 z-30 flex h-16 items-center gap-1.5 px-4 md:px-6">
          {/* Mobile nav trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={mobileSide} className="flex w-72 flex-col gap-0 p-0">
              <SheetTitle className="sr-only">{brand.academyName}</SheetTitle>
              <div className="flex h-16 shrink-0 items-center px-5">
                <BrandLogo />
              </div>
              {/* min-h-0 lets this shrink below its content height so overflow-y-auto engages. */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-3">
                <SidebarNav
                  sections={sections}
                  onNavigate={() => setMobileOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          <PushRegistrar />
          <NotificationsMenu items={notifications} unread={unread} />
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="ms-1">
            <UserMenu
              name={name}
              subtitle={subtitle}
              role={role}
              avatarUrl={avatarUrl}
            />
          </div>
        </header>


        {showReadOnly && (
          <div className="flex flex-wrap items-center gap-3 border-b border-warning/30 bg-warning/10 px-4 py-2.5 text-sm md:px-6">
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
            <span className="flex-1 text-foreground/90">
              {t.dashboard.ui.readOnlyBanner}
            </span>
          </div>
        )}

        <main
          className={cn(
            "flex-1 p-4 md:p-6 lg:p-8",
            // Room for the fixed bottom tab bar on mobile.
            role === "client" && "pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-8",
          )}
        >
          {children}
        </main>
        {role === "client" && <MobileTabBar items={sections[0]?.items ?? []} />}
      </div>
    </div>
  );
}
