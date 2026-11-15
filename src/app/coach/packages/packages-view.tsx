"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Check, EyeOff, Loader2, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import { deletePackageAction, movePackageAction, savePackageAction } from "@/lib/actions/client-signup";
import { cn, formatNumber } from "@/lib/utils";
import type { PackageDTO } from "@/lib/services/coaching-packages";

const TEXTAREA =
  "flex min-h-[104px] w-full rounded-[14px] border border-transparent bg-muted/70 px-3.5 py-2.5 text-base transition-[background-color,border-color,box-shadow] duration-200 placeholder:text-muted-foreground/80 hover:bg-muted focus-visible:border-ring/50 focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 md:text-sm";

function monthsLabel(months: number, locale: "ar" | "en") {
  if (locale === "en") return months === 1 ? "1 month" : `${months} months`;
  if (months === 1) return "شهر";
  if (months === 2) return "شهرين";
  if (months === 12) return "سنة";
  return `${months} شهور`;
}

export function PackagesView({ packages, canWrite }: { packages: PackageDTO[]; canWrite: boolean }) {
  const { locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const router = useRouter();
  const [editing, setEditing] = useState<PackageDTO | "new" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? L("حدث خطأ", "Something went wrong"));
      router.refresh();
    });
  }

  function remove(p: PackageDTO) {
    const sure = window.confirm(
      L(
        `حذف باقة «${p.name.ar}»؟ العملاء المشتركين فيها حالياً مش هيتأثروا.`,
        `Delete the "${p.name.en || p.name.ar}" package? Clients already subscribed are not affected.`,
      ),
    );
    if (sure) run(() => deletePackageAction(p.id));
  }

  return (
    <div>
      <PageHeader
        title={L("الباقات والأسعار", "Packages & pricing")}
        description={L(
          "دي الباقات اللي بتظهر للعملاء في الموقع وصفحة التسجيل. أي تعديل بيظهر فوراً.",
          "These are the packages clients see on the site and the sign-up page. Edits show immediately.",
        )}
      >
        <Button onClick={() => setEditing("new")} disabled={!canWrite}>
          <Plus className="h-4 w-4" />
          {L("باقة جديدة", "New package")}
        </Button>
      </PageHeader>

      {error && (
        <div role="alert" className="mb-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {packages.length === 0 ? (
        <EmptyState
          icon={Package}
          title={L("مفيش باقات", "No packages")}
          description={L("أضف باقة عشان العملاء يقدروا يسجلوا.", "Add a package so clients can sign up.")}
        />
      ) : (
        <div className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", isPending && "opacity-60")}>
          {packages.map((p, i) => (
            <Card key={p.id} className={cn("flex flex-col", !p.isActive && "opacity-70")}>
              <CardContent className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{p.name[locale] || p.name.ar}</h3>
                      {p.popular && <Badge>{L("الأكثر اختياراً", "Most chosen")}</Badge>}
                      {!p.isActive && (
                        <Badge variant="outline" className="gap-1 text-muted-foreground">
                          <EyeOff className="h-3 w-3" />
                          {L("مخفية", "Hidden")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {[p.tagline[locale] || p.tagline.ar, monthsLabel(p.months, locale)].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tabular-nums">{formatNumber(p.price, locale)}</span>
                  <span className="text-sm text-muted-foreground">{L("ج.م", "EGP")}</span>
                  {p.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatNumber(p.originalPrice, locale)}
                    </span>
                  )}
                </div>

                <ul className="flex-1 space-y-1.5 text-sm">
                  {p.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{f[locale] || f.ar}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-1 border-t border-border/70 pt-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={L("تحريك لأعلى", "Move up")}
                    disabled={!canWrite || i === 0}
                    onClick={() => run(() => movePackageAction(p.id, -1))}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={L("تحريك لأسفل", "Move down")}
                    disabled={!canWrite || i === packages.length - 1}
                    onClick={() => run(() => movePackageAction(p.id, 1))}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <div className="ms-auto flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      aria-label={L("حذف", "Delete")}
                      disabled={!canWrite}
                      onClick={() => remove(p)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" disabled={!canWrite} onClick={() => setEditing(p)}>
                      <Pencil className="h-4 w-4" />
                      {L("تعديل", "Edit")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PackageDialog
        target={editing}
        onClose={() => setEditing(null)}
        onDone={() => {
          setEditing(null);
          router.refresh();
        }}
      />
    </div>
  );
}

const EMPTY = {
  nameAr: "",
  nameEn: "",
  taglineAr: "",
  taglineEn: "",
  months: "1",
  price: "",
  originalPrice: "",
  featuresAr: "",
  featuresEn: "",
  popular: false,
  isActive: true,
};

function PackageDialog({
  target,
  onClose,
  onDone,
}: {
  target: PackageDTO | "new" | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const existing = target && target !== "new" ? target : null;

  useEffect(() => {
    if (!target) return;
    setError(null);
    setForm(
      existing
        ? {
            nameAr: existing.name.ar,
            nameEn: existing.name.en,
            taglineAr: existing.tagline.ar,
            taglineEn: existing.tagline.en,
            months: String(existing.months),
            price: String(existing.price),
            originalPrice: existing.originalPrice ? String(existing.originalPrice) : "",
            featuresAr: existing.features.map((f) => f.ar).join("\n"),
            featuresEn: existing.features.map((f) => f.en).join("\n"),
            popular: existing.popular,
            isActive: existing.isActive,
          }
        : EMPTY,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const set =
    (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save() {
    setError(null);
    setSaving(true);
    const res = await savePackageAction(existing?.id ?? null, {
      nameAr: form.nameAr,
      nameEn: form.nameEn,
      taglineAr: form.taglineAr,
      taglineEn: form.taglineEn,
      months: Number(form.months),
      price: Number(form.price),
      originalPrice: form.originalPrice.trim() ? Number(form.originalPrice) : null,
      featuresAr: form.featuresAr,
      featuresEn: form.featuresEn,
      popular: form.popular,
      isActive: form.isActive,
    });
    setSaving(false);
    if (!res.ok) {
      setError({ message: res.error, field: res.field });
      return;
    }
    onDone();
  }

  const fieldError = (f: string) =>
    error?.field === f ? <p className="text-sm text-destructive">{error.message}</p> : null;

  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? L("تعديل الباقة", "Edit package") : L("باقة جديدة", "New package")}</DialogTitle>
          <DialogDescription>
            {L("الأسعار بالجنيه المصري. اكتب كل ميزة في سطر.", "Prices are in EGP. Write one feature per line.")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pkg-name-ar">{L("اسم الباقة (عربي)", "Name (Arabic)")}</Label>
              <Input id="pkg-name-ar" dir="rtl" value={form.nameAr} onChange={set("nameAr")} placeholder="٣ شهور" />
              {fieldError("nameAr")}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pkg-name-en">{L("اسم الباقة (إنجليزي)", "Name (English)")}</Label>
              <Input id="pkg-name-en" dir="ltr" value={form.nameEn} onChange={set("nameEn")} placeholder="3 Months" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pkg-tag-ar">{L("وصف قصير (عربي)", "Tagline (Arabic)")}</Label>
              <Input id="pkg-tag-ar" dir="rtl" value={form.taglineAr} onChange={set("taglineAr")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pkg-tag-en">{L("وصف قصير (إنجليزي)", "Tagline (English)")}</Label>
              <Input id="pkg-tag-en" dir="ltr" value={form.taglineEn} onChange={set("taglineEn")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="pkg-months">{L("المدة (شهور)", "Months")}</Label>
              <Input id="pkg-months" dir="ltr" inputMode="numeric" value={form.months} onChange={set("months")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pkg-price">{L("السعر", "Price")}</Label>
              <Input id="pkg-price" dir="ltr" inputMode="decimal" value={form.price} onChange={set("price")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pkg-original">{L("قبل الخصم", "Before discount")}</Label>
              <Input
                id="pkg-original"
                dir="ltr"
                inputMode="decimal"
                value={form.originalPrice}
                onChange={set("originalPrice")}
                placeholder={L("اختياري", "Optional")}
              />
            </div>
          </div>
          {fieldError("months") ?? fieldError("price") ?? fieldError("originalPrice")}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pkg-feat-ar">{L("المميزات (عربي)", "Features (Arabic)")}</Label>
              <textarea id="pkg-feat-ar" dir="rtl" className={TEXTAREA} value={form.featuresAr} onChange={set("featuresAr")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pkg-feat-en">{L("المميزات (إنجليزي)", "Features (English)")}</Label>
              <textarea id="pkg-feat-en" dir="ltr" className={TEXTAREA} value={form.featuresEn} onChange={set("featuresEn")} />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[hsl(var(--primary))]"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              {L("ظاهرة للعملاء", "Visible to clients")}
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[hsl(var(--primary))]"
                checked={form.popular}
                onChange={(e) => setForm((f) => ({ ...f, popular: e.target.checked }))}
              />
              {L("علامة «الأكثر اختياراً»", "“Most chosen” badge")}
            </label>
          </div>

          {error && !error.field && (
            <div role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error.message}</div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t.common.cancel}</Button>
          <Button onClick={save} disabled={saving || !form.nameAr.trim() || !form.price.trim()}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {t.common.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
