"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./nav-config";
import { cn } from "@/lib/utils";

/**
 * Glass bottom tab bar for the client section on mobile (hidden lg+).
 * Shows at most five tabs; the rest stay reachable from the side sheet.
 */
const PRIMARY_TABS = ["/client", "/client/workout", "/client/nutrition", "/client/progress", "/client/messages"];

export function MobileTabBar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const tabs = items.filter((i) => PRIMARY_TABS.includes(i.href)).slice(0, 5);

  return (
    <nav
      aria-label="Tabs"
      className="glass hairline-t fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1">
        {tabs.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "press flex min-w-0 flex-1 flex-col items-center gap-1 px-1 pb-1.5 pt-2 text-[10.5px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                  active && "bg-primary/10",
                )}
              >
                <item.icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 1.9} />
              </span>
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
