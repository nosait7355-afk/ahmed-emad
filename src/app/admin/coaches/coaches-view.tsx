"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Users,
  MoreHorizontal,
  Ban,
  CheckCircle2,
  Trash2,
  Loader2,
  Plus,
  Star,
  Infinity as InfinityIcon,
  Copy,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatNumber } from "@/lib/utils";
import { formatRemaining } from "@/components/dashboard/subscription-countdown";
import {
  createCoachAction,
  setPrimaryCoachAction,
  makeCoachPermanentAction,
  setCoachStatusAction,
  suspendCoachSubscriptionAction,
  reactivateCoachSubscriptionAction,
  deleteCoachAction,
} from "@/lib/actions/admin";
import type { AccountStatus } from "@/lib/constants";

export interface CoachRow {
  id: string;
  name: string;
  email: string;
  brand?: string;
  /** Every public client sign-up is attached to the primary coach. */
  isPrimary: boolean;
  clients: number;
  status: AccountStatus;
  /** Trial/subscription end. Null for permanent accounts. */
  endDate?: string | null;
  suspendedByAdmin?: boolean;
}

export function CoachesView({ coaches }: { coaches: CoachRow[] }) {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const filtered = coaches.filter((c) => {
    const q = query.toLowerCase();
    const mq = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const ms = status === "all" || c.status === status;
    return mq && ms;
  });

  function run(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }
  function remove(c: CoachRow) {
    const warning = c.isPrimary
      ? L(
          `${c.name} هو المدرب الأساسي. لو اتحذف، تسجيلات العملاء الجديدة هتقف لحد ما تختار مدرب أساسي تاني. حذف المدرب وكل بياناته؟`,
          `${c.name} is the primary coach. New client sign-ups will stop until you choose another primary coach. Delete this coach and all their data?`,
        )
      : L(`حذف المدرب ${c.name} وكل بياناته؟`, `Delete coach ${c.name} and all their data?`);
    if (!window.confirm(warning)) return;
    run(() => deleteCoachAction(c.id));
  }

  const hasPrimary = coaches.some((c) => c.isPrimary);

  return (
    <div>
      <PageHeader title={t.dashboard.adminNav.coaches} description={`${coaches.length} ${t.dashboard.stats.totalCoaches}`}>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          {L("إضافة مدرب", "Add coach")}
        </Button>
      </PageHeader>

      {!hasPrimary && coaches.length > 0 && (
        <div className="mb-4 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm">
          {L(
            "مفيش مدرب أساسي محدد — العملاء الجدد مش هيقدروا يسجلوا. اختار مدرب من القائمة ← «تعيين كمدرب أساسي».",
            "No primary coach is set — new clients can't sign up. Pick a coach from the menu → “Set as primary coach”.",
          )}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground start-3" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.dashboard.ui.search} className="ps-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-48"><SelectValue placeholder={t.dashboard.ui.filterByStatus} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            <SelectItem value="active">{t.account.active}</SelectItem>
            <SelectItem value="trial">{t.account.trial}</SelectItem>
            <SelectItem value="expired">{t.account.expired}</SelectItem>
            <SelectItem value="suspended">{t.account.suspended}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={coaches.length === 0 ? L("مفيش مدربين لسه", "No coaches yet") : t.common.noResults}
          description={
            coaches.length === 0
              ? L("أضف حساب المدرب عشان العملاء يقدروا يسجلوا ويشتركوا.", "Add the coach account so clients can sign up and subscribe.")
              : t.common.emptyDescription
          }
        />
      ) : (
        <Card className={isPending ? "opacity-60" : ""}>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.name}</TableHead>
                  <TableHead className="hidden md:table-cell">{t.common.email}</TableHead>
                  <TableHead>{t.dashboard.stats.myClients}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead className="hidden lg:table-cell">{L("مدة الحساب", "Account term")}</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-xs text-primary">
                            {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{c.name}</span>
                            {c.isPrimary && (
                              <Badge className="gap-1 border-0 bg-primary/10 text-[10px] text-primary">
                                <Star className="h-3 w-3 fill-current" />
                                {L("المدرب الأساسي", "Primary coach")}
                              </Badge>
                            )}
                          </div>
                          {c.brand && <div className="text-xs text-muted-foreground">{c.brand}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell" dir="ltr">{c.email || "—"}</TableCell>
                    <TableCell>{formatNumber(c.clients, locale)}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <TermCell endDate={c.endDate} status={c.status} now={now} locale={locale} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={L("خيارات", "Options")}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!c.isPrimary && (
                            <DropdownMenuItem onClick={() => run(() => setPrimaryCoachAction(c.id))}>
                              <Star className="h-4 w-4" />{L("تعيين كمدرب أساسي", "Set as primary coach")}
                            </DropdownMenuItem>
                          )}
                          {(c.endDate || c.status === "trial" || c.status === "expired") && (
                            <DropdownMenuItem onClick={() => run(() => makeCoachPermanentAction(c.id))}>
                              <InfinityIcon className="h-4 w-4" />{L("تحويل لحساب دائم", "Make account permanent")}
                            </DropdownMenuItem>
                          )}
                          {c.suspendedByAdmin ? (
                            <DropdownMenuItem onClick={() => run(() => reactivateCoachSubscriptionAction(c.id))}>
                              <CheckCircle2 className="h-4 w-4" />{L("إلغاء وضع القراءة فقط", "Lift read-only mode")}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => run(() => suspendCoachSubscriptionAction(c.id))}>
                              <Ban className="h-4 w-4" />{L("وضع القراءة فقط", "Set read-only")}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {c.status === "suspended" ? (
                            <DropdownMenuItem onClick={() => run(() => setCoachStatusAction(c.id, "active"))}>
                              <CheckCircle2 className="h-4 w-4" />{L("رفع حظر الحساب", "Unblock account")}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => run(() => setCoachStatusAction(c.id, "suspended"))}>
                              <Ban className="h-4 w-4" />{L("حظر الحساب (منع تسجيل الدخول)", "Block account (prevent login)")}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => remove(c)} className="text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4" />{t.common.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <CreateCoachDialog
        open={createOpen}
        willBePrimary={!hasPrimary}
        onClose={() => setCreateOpen(false)}
        onDone={() => router.refresh()}
      />
    </div>
  );
}

function CreateCoachDialog({
  open,
  willBePrimary,
  onClose,
  onDone,
}: {
  open: boolean;
  willBePrimary: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const empty = { name: "", username: "", email: "", phone: "", password: "" };
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const [created, setCreated] = useState<{ username: string; password: string } | null>(null);

  useEffect(() => {
    if (open) {
      setForm(empty);
      setError(null);
      setCreated(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save() {
    setError(null);
    setSaving(true);
    const res = await createCoachAction(form);
    setSaving(false);
    if (!res.ok) {
      setError({ message: res.error, field: res.field });
      return;
    }
    setCreated({ username: form.username.trim().toLowerCase(), password: form.password });
    onDone();
  }

  const fieldError = (f: string) =>
    error?.field === f ? <p className="text-sm text-destructive">{error.message}</p> : null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{created ? L("تم إنشاء حساب المدرب", "Coach account created") : L("إضافة مدرب", "Add coach")}</DialogTitle>
          <DialogDescription>
            {created
              ? L("ابعت بيانات الدخول دي للمدرب. كلمة المرور مش هتظهر تاني.", "Send these sign-in details to the coach. The password won't be shown again.")
              : L(
                  "حساب دائم بدون فترة تجريبية أو تاريخ انتهاء أو حد للعملاء.",
                  "A permanent account with no trial, no end date and no client limit.",
                )}
          </DialogDescription>
        </DialogHeader>

        {created ? (
          <div className="space-y-3">
            <CredentialRow label={t.common.username} value={created.username} />
            <CredentialRow label={t.common.password} value={created.password} />
          </div>
        ) : (
          <div className="space-y-4">
            {willBePrimary && (
              <div className="flex items-start gap-2 rounded-xl bg-primary/10 px-3 py-2.5 text-sm text-primary">
                <Star className="mt-0.5 h-4 w-4 shrink-0 fill-current" />
                {L(
                  "ده هيبقى المدرب الأساسي — كل عميل يسجل من الموقع هيتربط بيه.",
                  "This will be the primary coach — every client who signs up on the site is attached to them.",
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="coach-name">{t.auth.fullName}</Label>
              <Input id="coach-name" value={form.name} onChange={set("name")} autoComplete="off" />
              {fieldError("name")}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coach-username">{t.common.username}</Label>
                <Input id="coach-username" dir="ltr" value={form.username} onChange={set("username")} autoComplete="off" />
                {fieldError("username")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="coach-password">{t.common.password}</Label>
                <Input id="coach-password" dir="ltr" type="text" value={form.password} onChange={set("password")} autoComplete="new-password" />
                {fieldError("password")}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coach-email">
                  {t.common.email} <span className="text-xs text-muted-foreground">({t.common.optional})</span>
                </Label>
                <Input id="coach-email" dir="ltr" type="email" value={form.email} onChange={set("email")} autoComplete="off" />
                {fieldError("email")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="coach-phone">
                  {t.common.phone} <span className="text-xs text-muted-foreground">({t.common.optional})</span>
                </Label>
                <Input id="coach-phone" dir="ltr" value={form.phone} onChange={set("phone")} autoComplete="off" />
                {fieldError("phone")}
              </div>
            </div>
            {error && !error.field && (
              <div className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error.message}</div>
            )}
          </div>
        )}

        <DialogFooter>
          {created ? (
            <Button onClick={onClose}>{L("تم", "Done")}</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>{t.common.cancel}</Button>
              <Button onClick={save} disabled={saving || !form.name || !form.username || !form.password}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {L("إنشاء الحساب", "Create account")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CredentialRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-muted/70 px-3.5 py-2.5">
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate font-mono text-sm" dir="ltr">{value}</div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        aria-label="Copy"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            /* clipboard unavailable */
          }
        }}
      >
        {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

/** Account term: permanent, or a live countdown for legacy trial/subscription coaches. */
function TermCell({
  endDate,
  status,
  now,
  locale,
}: {
  endDate?: string | null;
  status: AccountStatus;
  now: number;
  locale: "ar" | "en";
}) {
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);

  if (status === "suspended" || status === "expired") {
    return <span className="font-medium text-destructive">{L("موقوف", "Stopped")}</span>;
  }
  if (!endDate) {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-success">
        <InfinityIcon className="h-4 w-4" />
        {L("دائم", "Permanent")}
      </span>
    );
  }

  const remainingMs = new Date(endDate).getTime() - now;
  if (remainingMs <= 0) {
    return <span className="font-medium text-destructive">{L("منتهي", "Expired")}</span>;
  }
  return (
    <span className={remainingMs < 24 * 3600_000 ? "font-medium text-destructive" : "font-medium"}>
      {L("متبقي: ", "")}{formatRemaining(remainingMs, locale)}
    </span>
  );
}
