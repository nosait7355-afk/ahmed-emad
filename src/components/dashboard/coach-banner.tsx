"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageSquare, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { BRAND } from "@/config/brand";
import { formatNumber } from "@/lib/utils";

/** Hero banner at the top of the coach home: trainer photo, greeting, today's summary and quick actions. */
export function CoachBanner({
  firstName,
  activeClients,
  pendingCheckins,
  canWrite,
}: {
  firstName: string;
  activeClients: number;
  pendingCheckins: number;
  canWrite: boolean;
}) {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const active = formatNumber(activeClients, locale);
  const pending = formatNumber(pendingCheckins, locale);

  return (
    <section className="relative mb-6 overflow-hidden rounded-3xl bg-neutral-950 text-white shadow-soft">
      {/* Photo sits on the trailing side; the gradient keeps the text readable in both directions. */}
      <div className="absolute inset-y-0 end-0 w-2/3 sm:w-1/2">
        <Image
          src={BRAND.images.portrait}
          alt=""
          fill
          priority
          sizes="(min-width: 640px) 50vw, 66vw"
          className="object-cover object-top"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/10 rtl:bg-gradient-to-l" />

      <div className="relative flex min-h-[11rem] flex-col justify-center gap-4 p-5 sm:min-h-[13rem] sm:p-8">
        <div className="max-w-md space-y-1.5">
          <p className="text-eyebrow text-white/70">{t.dashboard.overview}</p>
          <h1 className="text-headline">
            {L("أهلاً", "Welcome")}
            {firstName ? ` ${firstName}` : ""}
          </h1>
          <p className="text-sm text-white/80">
            {L(
              `${active} متدرب نشط · ${pending} متابعة مستنية ردك`,
              `${active} active clients · ${pending} check-ins awaiting you`,
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canWrite && (
            <Button asChild>
              <Link href="/coach/clients/new">
                <UserPlus className="h-4 w-4" />
                {t.dashboard.coachNav.addClient}
              </Link>
            </Button>
          )}
          <Button asChild variant="secondary" className="bg-white/15 text-white hover:bg-white/25">
            <Link href="/coach/messages">
              <MessageSquare className="h-4 w-4" />
              {t.dashboard.coachNav.messages}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
