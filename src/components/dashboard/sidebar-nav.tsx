"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { NavSection } from "./nav-config";

/**
 * Determine the single active nav href: the longest item href that matches the
 * current pathname. Exact items must equal the pathname; others match the
 * pathname or any of its sub-paths. This prevents parent/child double-highlight
 * (e.g. /coach/clients vs /coach/clients/new).
 */
function resolveActiveHref(sections: NavSection[], pathname: string): string | null {
  let best: { href: string; len: number } | null = null;
  for (const section of sections) {
    for (const item of section.items) {
      const matches = item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`);
      if (matches && (!best || item.href.length > best.len)) {
        best = { href: item.href, len: item.href.length };
      }
    }
  }
  return best?.href ?? null;
}

export function SidebarNav({
  sections,
  onNavigate,
}: {
  sections: NavSection[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeHref = resolveActiveHref(sections, pathname);

  return (
    <nav className="flex flex-col gap-5 px-3 py-2">
      {sections.map((section, i) => (
        <div key={i} className="flex flex-col gap-1">
          {section.label && (
            <p className="text-eyebrow px-3 pb-1 text-muted-foreground/80">
              {section.label}
            </p>
          )}
          {section.items.map((item) => {
            const active = item.href === activeHref;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "press group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9rem] font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/75 hover:bg-muted/70 hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    active
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge ? (
                  <Badge
                    variant={active ? "default" : "secondary"}
                    className="h-5 min-w-5 justify-center px-1.5 text-[11px]"
                  >
                    {item.badge}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
