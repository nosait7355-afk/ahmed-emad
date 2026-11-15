"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Dumbbell,
  Flame,
  Scale,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { LineTrend } from "@/components/dashboard/charts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useI18n } from "@/components/providers/i18n-provider";
import { FrozenBanner, SubscriptionCountdownBanner } from "@/components/client/access-banners";
import type { ClientAccessState } from "@/lib/services/subscription";
import { cn } from "@/lib/utils";

interface HomeData {
  currentWeight: number | null;
  weightChange: number | null;
  streak: number;
  trainedThisWeek: number;
  daysPerWeek: number | null;
  firstName: string;
  planCalories: number | null;
  todayWorkout: { name: string; exercises: { name: string; sets: number; reps: string }[] } | null;
  todayMeals: { name: string; kcal: number }[] | null;
  weightSeries: { label: string; value: number }[];
}

export function ClientHome({ data, access }: { data: HomeData; access: ClientAccessState }) {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const Chevron = locale === "ar" ? ChevronLeft : ChevronRight;

  // Subscription ring: share of the period still remaining.
  const end = access.subscriptionEndDate ? new Date(access.subscriptionEndDate) : null;
  const start = access.subscriptionStartDate ? new Date(access.subscriptionStartDate) : null;
  const totalDays =
    end && start ? Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000)) : null;
  const remaining =
    access.daysRemaining ?? (end ? Math.ceil((end.getTime() - Date.now()) / 86_400_000) : null);
  const subPct = totalDays && remaining != null ? (Math.max(0, remaining) / totalDays) * 100 : 0;

  const weekTarget = data.daysPerWeek ?? 7;
  const weekPct = (data.trainedThisWeek / Math.max(1, weekTarget)) * 100;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      {/* Greeting */}
      <header className="space-y-1 pt-1">
        <p className="text-eyebrow text-muted-foreground">{t.dashboard.overview}</p>
        <h1 className="text-headline">
          {L("أهلاً", "Hi")}
          {data.firstName ? ` ${data.firstName}` : ""} 👋
        </h1>
      </header>

      {access.frozen ? (
        <FrozenBanner reason={access.frozenReason!} remainingDays={access.frozenRemainingDays} />
      ) : (
        remaining != null && <SubscriptionCountdownBanner daysRemaining={remaining} />
      )}

      {/* Rings */}
      <Card className="p-5 sm:p-6">
        <div className="grid grid-cols-3 gap-3 text-center">
          <RingStat
            value={weekPct}
            tone="primary"
            big={`${data.trainedThisWeek}/${weekTarget}`}
            caption={L("تمارين الأسبوع", "This week")}
            label={L(`${data.trainedThisWeek} من ${weekTarget} أيام تمرين`, `${data.trainedThisWeek} of ${weekTarget} training days`)}
          />
          <RingStat
            value={Math.min(100, data.streak * 10)}
            tone="warning"
            big={String(data.streak)}
            caption={t.client.streak}
            label={`${t.client.streak}: ${data.streak}`}
          />
          <RingStat
            value={subPct}
            tone={remaining != null && remaining <= 3 ? "destructive" : "success"}
            big={remaining != null ? String(Math.max(0, remaining)) : "—"}
            caption={L("يوم في اشتراكك", "Days left")}
            label={
              remaining != null
                ? L(`باقي ${Math.max(0, remaining)} يوم في الاشتراك`, `${Math.max(0, remaining)} days left in subscription`)
                : L("لا يوجد اشتراك", "No subscription")
            }
          />
        </div>
        {end && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {L("الاشتراك ينتهي في", "Subscription ends on")}{" "}
            <span dir="ltr">{end.toLocaleDateString("en-GB")}</span>
          </p>
        )}
      </Card>

      {/* Weight tiles */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Tile icon={Scale} label={t.client.currentWeight}>
          {data.currentWeight != null ? (
            <>
              {data.currentWeight}
              <span className="ms-1 text-sm font-medium text-muted-foreground">kg</span>
            </>
          ) : (
            "—"
          )}
        </Tile>
        <Tile icon={Flame} label={L("التغير من البداية", "Change since start")}>
          {data.weightChange != null ? (
            <span className={cn(data.weightChange < 0 && "text-success")} dir="ltr">
              {data.weightChange > 0 ? "+" : ""}
              {data.weightChange}
              <span className="ms-1 text-sm font-medium text-muted-foreground">kg</span>
            </span>
          ) : (
            "—"
          )}
        </Tile>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Today's workout */}
        <Card className="overflow-hidden lg:col-span-3">
          <div className="flex items-center gap-3 p-5 pb-3">
            <IconBadge icon={Dumbbell} />
            <div className="min-w-0">
              <p className="font-semibold">{t.client.todayWorkout}</p>
              {data.todayWorkout && (
                <p className="truncate text-sm text-muted-foreground">{data.todayWorkout.name}</p>
              )}
            </div>
          </div>
          <div className="space-y-1.5 px-5">
            {!data.todayWorkout ? (
              <p className="py-6 text-center text-sm text-muted-foreground">{t.client.noWorkoutToday}</p>
            ) : (
              data.todayWorkout.exercises.slice(0, 5).map((ex, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl bg-muted/50 px-3.5 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background text-xs font-semibold tabular-nums">
                    {i + 1}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm font-medium">{ex.name}</p>
                  <p className="shrink-0 text-xs text-muted-foreground" dir="ltr">
                    {ex.sets} × {ex.reps}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="p-5">
            {access.frozen ? (
              <Button size="lg" className="w-full" disabled>
                {data.todayWorkout ? L("ابدأ التمرين", "Start workout") : t.client.logWeights}
              </Button>
            ) : (
              <Button asChild size="lg" className="w-full">
                <Link href={data.todayWorkout ? "/client/workout?autostart=1" : "/client/workout"}>
                  {data.todayWorkout ? L("ابدأ التمرين", "Start workout") : t.client.logWeights}
                </Link>
              </Button>
            )}
          </div>
        </Card>

        {/* Weight trend */}
        <Card className="p-5 lg:col-span-2">
          <p className="mb-3 font-semibold">{t.client.weightTrend}</p>
          {data.weightSeries.length > 1 ? (
            <LineTrend data={data.weightSeries} xKey="label" yKey="value" height={200} />
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">{L("لا توجد بيانات بعد", "No data yet")}</p>
          )}
        </Card>
      </div>

      {/* Today's meals */}
      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <IconBadge icon={UtensilsCrossed} />
            <div>
              <p className="font-semibold">{t.client.todayMeals}</p>
              {data.planCalories != null && (
                <p className="text-sm text-muted-foreground">
                  {data.planCalories} {t.client.calories}
                </p>
              )}
            </div>
          </div>
          <Link href="/client/nutrition" className="press flex items-center gap-0.5 text-sm font-medium text-primary">
            {t.dashboard.clientNav.nutrition}
            <Chevron className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-1.5">
          {!data.todayMeals || data.todayMeals.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{t.client.noMealsToday}</p>
          ) : (
            data.todayMeals.map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-muted/50 px-3.5 py-3">
                <span className="flex-1 text-sm font-medium">{m.name}</span>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {m.kcal} {t.client.calories}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Shortcuts to screens not in the bottom tab bar */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Shortcut href="/client/checkin" icon={ClipboardCheck} label={t.dashboard.clientNav.checkin} chevron={Chevron} />
        <Shortcut href="/client/profile" icon={User} label={t.dashboard.clientNav.profile} chevron={Chevron} />
      </div>
    </div>
  );
}

type IconType = React.ComponentType<{ className?: string }>;

function RingStat({
  value,
  tone,
  big,
  caption,
  label,
}: {
  value: number;
  tone: "primary" | "success" | "warning" | "destructive";
  big: string;
  caption: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <ProgressRing value={value} tone={tone} label={label} size={88} stroke={9}>
        <span className="text-lg font-bold tabular-nums" dir="ltr">
          {big}
        </span>
      </ProgressRing>
      <span className="text-xs font-medium text-muted-foreground">{caption}</span>
    </div>
  );
}

function IconBadge({ icon: Icon }: { icon: IconType }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <Icon className="h-5 w-5" />
    </span>
  );
}

function Tile({ icon: Icon, label, children }: { icon: IconType; label: string; children: React.ReactNode }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums">{children}</p>
    </Card>
  );
}

function Shortcut({
  href,
  icon,
  label,
  chevron: Chevron,
}: {
  href: string;
  icon: IconType;
  label: string;
  chevron: IconType;
}) {
  return (
    <Link href={href} className="press lift flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft">
      <IconBadge icon={icon} />
      <span className="flex-1 font-medium">{label}</span>
      <Chevron className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
