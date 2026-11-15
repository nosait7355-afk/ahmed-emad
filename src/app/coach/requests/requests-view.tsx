"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addMonths } from "date-fns";
import { CheckCircle2, Inbox, Loader2, MessageCircle, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import { activateSignupAction, rejectSignupAction } from "@/lib/actions/client-signup";
import { GENDER_LABELS, GOAL_LABELS } from "@/lib/i18n/labels";
import { formatFullDateTime, formatNumber } from "@/lib/utils";
import type { ClientGoal, Gender } from "@/lib/constants";
import type { PackageDTO } from "@/lib/services/coaching-packages";

export interface SignupRequestRow {
  id: string;
  name: string;
  username: string;
  phone: string;
  email: string;
  gender?: Gender;
  age?: number;
  height?: number;
  weight?: number;
  goal?: ClientGoal;
  requestedAt: string;
  package: { id: string; name: { ar: string; en: string }; price: number; months: number } | null;
}

export function RequestsView({
  requests,
  packages,
  canWrite,
}: {
  requests: SignupRequestRow[];
  packages: PackageDTO[];
  canWrite: boolean;
}) {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const router = useRouter();
  const [activating, setActivating] = useState<SignupRequestRow | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reject(r: SignupRequestRow) {
    const sure = window.confirm(
      L(
        `رفض طلب ${r.name}؟ الحساب هيتحذف نهائياً ومش هيقدر يسجل دخول.`,
        `Decline ${r.name}'s request? The account is deleted permanently and can no longer sign in.`,
      ),
    );
    if (!sure) return;
    setError(null);
    setBusyId(r.id);
    const res = await rejectSignupAction(r.id);
    setBusyId(null);
    if (!res.ok) setError(res.error);
    router.refresh();
  }

  return (
    <div>
      <PageHeader
        title={t.dashboard.coachNav.signupRequests}
        description={L(
          "عملاء سجلوا من الموقع ومستنيين تأكيد الدفع. فعّل الاشتراك بعد ما التحويل يوصلك.",
          "Clients who signed up on the site and are waiting for payment confirmation. Activate once the transfer arrives.",
        )}
      />

      {error && (
        <div role="alert" className="mb-4 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={L("مفيش طلبات جديدة", "No new requests")}
          description={L(
            "أي عميل يسجل من الموقع هيظهر هنا، وهيوصلك إشعار بيه.",
            "Anyone who signs up on the site appears here, and you get a notification.",
          )}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {requests.map((r) => {
            const waPhone = r.phone.replace(/[^0-9]/g, "");
            const facts = [
              r.gender && GENDER_LABELS[r.gender][locale],
              r.age != null && L(`${r.age} سنة`, `${r.age} yrs`),
              r.height != null && L(`${r.height} سم`, `${r.height} cm`),
              r.weight != null && L(`${r.weight} كجم`, `${r.weight} kg`),
              r.goal && GOAL_LABELS[r.goal][locale],
            ].filter(Boolean) as string[];
            const busy = busyId === r.id;

            return (
              <Card key={r.id} className={busy ? "opacity-60" : ""}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="bg-primary/10 text-sm text-primary">
                        {r.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{r.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatFullDateTime(r.requestedAt, locale)}
                      </div>
                    </div>
                    {r.package && (
                      <div className="shrink-0 text-end">
                        <div className="text-lg font-bold tabular-nums">
                          {formatNumber(r.package.price, locale)}{" "}
                          <span className="text-xs font-medium text-muted-foreground">{L("ج.م", "EGP")}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{r.package.name[locale] || r.package.name.ar}</div>
                      </div>
                    )}
                  </div>

                  {facts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {facts.map((f) => (
                        <Badge key={f} variant="secondary" className="font-medium">{f}</Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    {waPhone && (
                      <Button asChild variant="outline" size="sm">
                        <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-4 w-4" />
                          <span dir="ltr">{r.phone}</span>
                        </a>
                      </Button>
                    )}
                    <div className="ms-auto flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={!canWrite || busy}
                        onClick={() => reject(r)}
                      >
                        <Trash2 className="h-4 w-4" />
                        {L("رفض", "Decline")}
                      </Button>
                      <Button size="sm" disabled={!canWrite || busy} onClick={() => setActivating(r)}>
                        <CheckCircle2 className="h-4 w-4" />
                        {L("تفعيل الاشتراك", "Activate")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ActivateDialog
        request={activating}
        packages={packages}
        onClose={() => setActivating(null)}
        onDone={() => {
          setActivating(null);
          router.refresh();
        }}
      />
    </div>
  );
}

function ActivateDialog({
  request,
  packages,
  onClose,
  onDone,
}: {
  request: SignupRequestRow | null;
  packages: PackageDTO[];
  onClose: () => void;
  onDone: () => void;
}) {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const [packageId, setPackageId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The requested package may have been hidden or deleted since sign-up; it is
  // still honoured from the snapshot, so offer it as "as requested".
  const REQUESTED = "__requested__";
  const requestedStillListed = !!request?.package && packages.some((p) => p.id === request.package!.id);

  useEffect(() => {
    if (!request) return;
    setError(null);
    setPackageId(requestedStillListed ? request.package!.id : request.package ? REQUESTED : packages[0]?.id ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const chosen =
    packageId === REQUESTED
      ? request?.package ?? null
      : packages.find((p) => p.id === packageId) ?? null;
  const endDate = chosen ? addMonths(new Date(), chosen.months) : null;

  async function save() {
    if (!request || !chosen) return;
    setError(null);
    setSaving(true);
    const res = await activateSignupAction(request.id, packageId === REQUESTED ? undefined : packageId);
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onDone();
  }

  return (
    <Dialog open={!!request} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{L("تفعيل اشتراك", "Activate subscription")} — {request?.name}</DialogTitle>
          <DialogDescription>
            {L(
              "أكّد إن التحويل وصلك. الاشتراك هيبدأ من النهارده والعميل هيوصله إشعار.",
              "Confirm the transfer arrived. The subscription starts today and the client is notified.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{L("الباقة", "Plan")}</Label>
            <Select value={packageId} onValueChange={setPackageId}>
              <SelectTrigger><SelectValue placeholder={L("اختر باقة", "Select a plan")} /></SelectTrigger>
              <SelectContent>
                {request?.package && !requestedStillListed && (
                  <SelectItem value={REQUESTED}>
                    {request.package.name[locale] || request.package.name.ar} — {formatNumber(request.package.price, locale)}{" "}
                    {L("ج.م (زي ما طلب)", "EGP (as requested)")}
                  </SelectItem>
                )}
                {packages.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name[locale] || p.name.ar} — {formatNumber(p.price, locale)} {L("ج.م", "EGP")}
                    {request?.package?.id === p.id ? L(" (اللي طلبها)", " (requested)") : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {chosen && endDate && (
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-muted/60 p-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">{L("المدة", "Length")}</div>
                <div className="font-semibold">
                  {L(
                    chosen.months === 1 ? "شهر" : chosen.months === 2 ? "شهرين" : `${chosen.months} شهور`,
                    chosen.months === 1 ? "1 month" : `${chosen.months} months`,
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{L("ينتهي في", "Ends on")}</div>
                <div className="font-semibold">
                  {endDate.toLocaleDateString(locale === "ar" ? "ar-EG-u-nu-latn" : "en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          )}

          {error && <div role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t.common.cancel}</Button>
          <Button onClick={save} disabled={saving || !chosen}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {L("تأكيد الدفع وتفعيل", "Confirm payment & activate")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
