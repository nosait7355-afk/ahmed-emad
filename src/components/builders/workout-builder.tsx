"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import {
  Plus,
  Minus,
  Trash2,
  GripVertical,
  ChevronDown,
  Search,
  Save,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Copy,
  Star,
  Check,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useI18n } from "@/components/providers/i18n-provider";
import { searchExercisesAction, getExerciseMediaAction, type ExercisePickerItem, type ExerciseMediaInfo } from "@/lib/actions/exercises";
import type { ActionResult } from "@/lib/actions/result";
import { cn } from "@/lib/utils";
import { ExerciseMedia } from "@/components/library/exercise-media";
import { addRecent, getFavorites, getRecents, toggleFavorite, type StoredExercise } from "@/lib/exercise-recents";

export interface BExercise {
  exercise?: string | null;
  nameAr: string;
  nameEn: string;
  sets: number;
  reps: string;
  restSeconds: number;
  tempo?: string;
  notes?: string;
  order: number;
}
export interface BDay {
  dayNumber: number;
  name: { ar: string; en: string };
  exercises: BExercise[];
  notes?: string;
}
export interface BWeek {
  weekNumber: number;
  name?: { ar?: string; en?: string };
  days: BDay[];
}

/* ---- Editor-only shape: every exercise carries a temporary `uid` so drag-reorder
 * and expand/collapse can track rows precisely. It is stripped before saving, so
 * the persisted data (and schema) never change. ---- */
interface UExercise extends BExercise { uid: string }
interface UDay extends Omit<BDay, "exercises"> { exercises: UExercise[] }
interface UWeek extends Omit<BWeek, "days"> { days: UDay[] }

let uidCounter = 0;
const newUid = () => `ex-${Date.now().toString(36)}-${(uidCounter++).toString(36)}`;

function withUids(weeks: BWeek[]): UWeek[] {
  return weeks.map((w) => ({ ...w, days: w.days.map((d) => ({ ...d, exercises: d.exercises.map((e) => ({ ...e, uid: newUid() })) })) }));
}

function stripUids(weeks: UWeek[]): BWeek[] {
  return weeks.map((w) => ({
    ...w,
    days: w.days.map((d) => ({
      ...d,
      exercises: d.exercises.map(({ uid: _uid, ...e }) => e),
    })),
  }));
}

/** Deep clone that gives every exercise a fresh uid (for copy day / copy week). */
function cloneDay(d: UDay): UDay {
  const copy = JSON.parse(JSON.stringify(d)) as UDay;
  copy.exercises.forEach((e) => (e.uid = newUid()));
  return copy;
}

const REP_PRESETS: { sets: number; reps: string }[] = [
  { sets: 3, reps: "8-12" },
  { sets: 4, reps: "10" },
  { sets: 5, reps: "5" },
  { sets: 3, reps: "12-15" },
  { sets: 4, reps: "6-8" },
];

const spring = { type: "spring" as const, stiffness: 500, damping: 38, mass: 0.8 };

type PickedExercise = StoredExercise;

export function WorkoutBuilder({
  backHref,
  title,
  subtitle,
  initialNameAr,
  initialNameEn,
  initialWeeks,
  onSave,
  flat = false,
}: {
  backHref?: string;
  title?: string;
  subtitle?: string;
  initialNameAr: string;
  initialNameEn: string;
  initialWeeks: BWeek[];
  onSave: (data: { nameAr: string; nameEn: string; weeks: BWeek[] }) => Promise<ActionResult>;
  /** Inline mode for embedding directly on the client page: no weeks UI (single
   * implicit week), day-tabs instead of week cards, and the exercise library
   * shown inline under the open day instead of in a popup. */
  flat?: boolean;
}) {
  const { t, locale, dir } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const router = useRouter();
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const [nameAr, setNameAr] = useState(initialNameAr);
  const [nameEn, setNameEn] = useState(initialNameEn);
  const [weeks, setWeeks] = useState<UWeek[]>(() =>
    withUids(initialWeeks.length ? initialWeeks : [{ weekNumber: 1, name: { ar: "الأسبوع 1", en: "Week 1" }, days: [] }]),
  );
  const [picker, setPicker] = useState<{ w: number; d: number } | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [saving, startSaving] = useTransition();
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [mediaMap, setMediaMap] = useState<Record<string, ExerciseMediaInfo>>({});

  // Fetch thumbnails for any exercise already in the program that we don't have media for yet.
  useEffect(() => {
    const ids = [...new Set(weeks.flatMap((w) => w.days.flatMap((d) => d.exercises.map((e) => e.exercise).filter(Boolean) as string[])))];
    const missing = ids.filter((id) => !(id in mediaMap));
    if (missing.length === 0) return;
    getExerciseMediaAction(missing).then((res) => {
      if (res.ok) setMediaMap((prev) => ({ ...prev, ...res.data! }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeks]);

  const mut = (fn: (draft: UWeek[]) => void) => {
    setDirty(true);
    setWeeks((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as UWeek[];
      fn(next);
      return next;
    });
  };

  const toggleExpanded = (uid: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });

  const addWeek = () => mut((w) => w.push({ weekNumber: w.length + 1, name: { ar: `الأسبوع ${w.length + 1}`, en: `Week ${w.length + 1}` }, days: [] }));
  const removeWeek = (wi: number) => mut((w) => { w.splice(wi, 1); w.forEach((x, i) => (x.weekNumber = i + 1)); });
  const copyWeek = (wi: number) =>
    mut((w) => {
      const src = w[wi];
      const copy: UWeek = { ...JSON.parse(JSON.stringify(src)), days: src.days.map(cloneDay) };
      w.splice(wi + 1, 0, copy);
      w.forEach((x, i) => {
        x.weekNumber = i + 1;
        x.name = { ar: `الأسبوع ${i + 1}`, en: `Week ${i + 1}` };
      });
    });
  const addDay = (wi: number) => mut((w) => { const d = w[wi].days; d.push({ dayNumber: d.length + 1, name: { ar: `اليوم ${d.length + 1}`, en: `Day ${d.length + 1}` }, exercises: [] }); });
  const removeDay = (wi: number, di: number) => mut((w) => { w[wi].days.splice(di, 1); w[wi].days.forEach((x, i) => (x.dayNumber = i + 1)); });
  const copyDay = (wi: number, di: number) =>
    mut((w) => {
      const days = w[wi].days;
      const copy = cloneDay(days[di]);
      copy.name = { ar: `${days[di].name.ar} (نسخة)`, en: `${days[di].name.en} (copy)` };
      days.splice(di + 1, 0, copy);
      days.forEach((x, i) => (x.dayNumber = i + 1));
    });
  const addExercise = (wi: number, di: number, ex: PickedExercise) => {
    const { videoUrl, youtubeUrl, imageUrlStart, imageUrlEnd, gifUrl } = ex;
    setMediaMap((prev) => (ex.id in prev ? prev : { ...prev, [ex.id]: { videoUrl, youtubeUrl, imageUrlStart, imageUrlEnd, gifUrl } }));
    mut((w) => {
      const list = w[wi].days[di].exercises;
      list.push({ uid: newUid(), exercise: ex.id, nameAr: ex.nameAr, nameEn: ex.nameEn, sets: 3, reps: "8-12", restSeconds: 60, order: list.length + 1 });
    });
  };
  const removeExercise = (wi: number, di: number, uid: string) =>
    mut((w) => {
      const day = w[wi].days[di];
      day.exercises = day.exercises.filter((e) => e.uid !== uid);
      day.exercises.forEach((x, i) => (x.order = i + 1));
    });
  /** Drag-reorder: keeps the same exercise objects, only re-sequences them. */
  const reorderDay = (wi: number, di: number, list: UExercise[]) => {
    setDirty(true);
    setWeeks((prev) =>
      prev.map((w, i) =>
        i !== wi
          ? w
          : { ...w, days: w.days.map((d, j) => (j !== di ? d : { ...d, exercises: list.map((e, k) => ({ ...e, order: k + 1 })) })) },
      ),
    );
  };
  const patchExercise = (wi: number, di: number, uid: string, patch: Partial<BExercise>) =>
    mut((w) => {
      const ex = w[wi].days[di].exercises.find((e) => e.uid === uid);
      if (ex) Object.assign(ex, patch);
    });

  function save() {
    setSaveError(null);
    startSaving(async () => {
      const res = await onSave({ nameAr, nameEn, weeks: stripUids(weeks) });
      if (res.ok) {
        setDirty(false);
        setSavedAt(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
        router.refresh();
      } else {
        setSaveError(res.error ?? L("تعذّر الحفظ", "Couldn't save"));
      }
    });
  }

  function exerciseList(wi: number, di: number, day: UDay) {
    return (
      <Reorder.Group axis="y" as="div" values={day.exercises} onReorder={(list) => reorderDay(wi, di, list)} className="space-y-2">
        <AnimatePresence initial={false}>
          {day.exercises.map((ex) => (
            <ExerciseRow
              key={ex.uid}
              ex={ex}
              media={ex.exercise ? mediaMap[ex.exercise] : undefined}
              expanded={expanded.has(ex.uid)}
              onToggle={() => toggleExpanded(ex.uid)}
              onPatch={(patch) => patchExercise(wi, di, ex.uid, patch)}
              onRemove={() => removeExercise(wi, di, ex.uid)}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>
    );
  }

  const nameFields = (
    <div className="mb-4 grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5"><Label>{L("الاسم بالعربية", "Arabic name")}</Label><Input value={nameAr} onChange={(e) => { setNameAr(e.target.value); setDirty(true); }} /></div>
      <div className="space-y-1.5"><Label>{L("الاسم بالإنجليزية", "English name")}</Label><Input dir="ltr" value={nameEn} onChange={(e) => { setNameEn(e.target.value); setDirty(true); }} /></div>
    </div>
  );

  const saveStatus = saving
    ? L("جارٍ الحفظ…", "Saving…")
    : saveError
      ? saveError
      : dirty
        ? L("لم يُحفظ بعد", "Not saved yet")
        : savedAt
          ? L(`تم الحفظ ${savedAt}`, `Saved ${savedAt}`)
          : L("لا توجد تغييرات", "No changes");

  const saveBar = (
    <div className="sticky bottom-0 z-20 mt-6 flex items-center justify-between gap-3 border-t bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <span className={cn("text-sm", saveError ? "text-destructive" : dirty ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
        {saveStatus}
      </span>
      <Button onClick={save} disabled={saving} className="gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {t.common.save}
      </Button>
    </div>
  );

  if (flat) {
    const days = weeks[0]?.days ?? [];
    const day = days[activeDay];
    return (
      <div>
        {backHref && <Button asChild variant="ghost" size="sm" className="mb-3 -ms-2"><Link href={backHref}><BackArrow className="h-4 w-4" />{title}</Link></Button>}
        {nameFields}
        {subtitle && <p className="mb-4 text-sm text-muted-foreground">{subtitle}</p>}

        <div className="flex flex-wrap items-center gap-1.5">
          {days.map((d, di) => (
            <button
              key={di}
              type="button"
              onClick={() => setActiveDay(di)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                activeDay === di ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-accent",
              )}
            >
              {d.name[locale] || L(`اليوم ${di + 1}`, `Day ${di + 1}`)}
            </button>
          ))}
          <Button variant="outline" size="sm" onClick={() => { addDay(0); setActiveDay(days.length); }} className="gap-1.5">
            <Plus className="h-4 w-4" />{L("إضافة يوم", "Add day")}
          </Button>
        </div>
        {days.length === 0 && <p className="mt-3 text-sm text-muted-foreground">{L("لا توجد أيام بعد — أضف اليوم الأول.", "No days yet — add the first one.")}</p>}

        {day && (
          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
              <Input
                className="h-8 max-w-xs"
                value={day.name[locale]}
                onChange={(e) => mut((w) => { w[0].days[activeDay].name[locale] = e.target.value; })}
              />
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { copyDay(0, activeDay); setActiveDay(activeDay + 1); }}>
                  <Copy className="h-4 w-4" />{L("نسخ اليوم", "Copy day")}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => { removeDay(0, activeDay); setActiveDay((i) => Math.max(0, i - 1)); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {day.exercises.length === 0 && (
                <p className="text-sm text-muted-foreground">{L("لا توجد تمارين لهذا اليوم — أضف تمريناً من المكتبة بالأسفل.", "No exercises for this day yet — add one from the library below.")}</p>
              )}
              {exerciseList(0, activeDay, day)}
            </CardContent>
          </Card>
        )}

        {day && (
          <div className="mt-5">
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{L("مكتبة التمارين", "Exercise library")}</h3>
            <Card>
              <CardContent className="p-4">
                <ExerciseLibraryPanel
                  onPick={(ex) => addExercise(0, activeDay, ex)}
                  addedIds={new Set(day.exercises.map((e) => e.exercise).filter(Boolean) as string[])}
                  gridClassName="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {saveBar}
      </div>
    );
  }

  return (
    <div>
      {backHref && <Button asChild variant="ghost" size="sm" className="mb-3 -ms-2"><Link href={backHref}><BackArrow className="h-4 w-4" />{title}</Link></Button>}

      {nameFields}
      {subtitle && <p className="mb-4 text-sm text-muted-foreground">{subtitle}</p>}

      <div className="space-y-5">
        {weeks.map((week, wi) => (
          <Card key={wi}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
              <CardTitle className="text-base">{L(`الأسبوع ${week.weekNumber}`, `Week ${week.weekNumber}`)}</CardTitle>
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => addDay(wi)}><Plus className="h-4 w-4" />{L("يوم", "Day")}</Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => copyWeek(wi)}><Copy className="h-4 w-4" />{L("نسخ الأسبوع", "Copy week")}</Button>
                {weeks.length > 1 && <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeWeek(wi)}><Trash2 className="h-4 w-4" /></Button>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {week.days.length === 0 && <p className="text-sm text-muted-foreground">{L("لا توجد أيام — أضف يوماً.", "No days — add one.")}</p>}
              {week.days.map((day, di) => (
                <div key={di} className="rounded-lg border p-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <Input className="h-8 max-w-xs" value={day.name[locale]} onChange={(e) => mut((w) => { w[wi].days[di].name[locale] = e.target.value; })} />
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => setPicker({ w: wi, d: di })}><Plus className="h-4 w-4" />{L("تمرين", "Exercise")}</Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title={L("نسخ اليوم", "Copy day")} onClick={() => copyDay(wi, di)}><Copy className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeDay(wi, di)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  {exerciseList(wi, di, day)}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
        <Button variant="outline" onClick={addWeek} className="gap-2"><Plus className="h-4 w-4" />{L("إضافة أسبوع", "Add week")}</Button>
      </div>

      {saveBar}

      <ExercisePicker
        open={!!picker}
        onClose={() => setPicker(null)}
        onPick={(ex) => { if (picker) addExercise(picker.w, picker.d, ex); }}
      />
    </div>
  );
}

/* ---------------- Exercise row (collapsed summary / expanded editor) ---------------- */

function ExerciseRow({
  ex,
  media,
  expanded,
  onToggle,
  onPatch,
  onRemove,
}: {
  ex: UExercise;
  media?: ExerciseMediaInfo;
  expanded: boolean;
  onToggle: () => void;
  onPatch: (patch: Partial<BExercise>) => void;
  onRemove: () => void;
}) {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const controls = useDragControls();
  const name = locale === "ar" ? ex.nameAr : ex.nameEn;
  const summary = `${ex.sets} ${L("مجموعات", "sets")} · ${ex.reps} ${L("عدة", "reps")} · ${ex.restSeconds}${L("ث", "s")} ${L("راحة", "rest")}`;

  return (
    <Reorder.Item
      as="div"
      value={ex}
      dragListener={false}
      dragControls={controls}
      layout="position"
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={spring}
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 10 }}
      className="relative rounded-md border bg-muted/30"
    >
      <div className="flex items-center gap-2 p-2">
        <button
          type="button"
          aria-label={L("اسحب لإعادة الترتيب", "Drag to reorder")}
          onPointerDown={(e) => controls.start(e)}
          className="shrink-0 cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-accent active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-2 text-start" aria-expanded={expanded}>
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
            <ExerciseMedia
              media={media ?? {}}
              alt={name}
              className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden"
              iconClassName="h-5 w-5 text-muted-foreground/40"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{summary}</p>
          </div>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")} />
        </button>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive" onClick={onRemove} aria-label={t.common.delete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {expanded && (
        <div className="space-y-3 border-t px-2 pb-3 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {REP_PRESETS.map((p) => {
              const active = ex.sets === p.sets && ex.reps === p.reps;
              return (
                <button
                  key={`${p.sets}x${p.reps}`}
                  type="button"
                  onClick={() => onPatch({ sets: p.sets, reps: p.reps })}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums transition-colors",
                    active ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-accent",
                  )}
                  dir="ltr"
                >
                  {p.sets}×{p.reps}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Field label={t.client.sets}>
              <Stepper value={ex.sets} step={1} min={0} onChange={(v) => onPatch({ sets: v })} />
            </Field>
            <Field label={t.client.reps}>
              <Input className="h-9" value={ex.reps} onChange={(e) => onPatch({ reps: e.target.value })} />
            </Field>
            <Field label={`${t.client.rest} (${L("ث", "s")})`}>
              <Stepper value={ex.restSeconds} step={15} min={0} onChange={(v) => onPatch({ restSeconds: v })} />
            </Field>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Tempo"><Input className="h-9" value={ex.tempo ?? ""} onChange={(e) => onPatch({ tempo: e.target.value })} /></Field>
            <Field label={L("ملاحظات", "Notes")}><Input className="h-9" value={ex.notes ?? ""} onChange={(e) => onPatch({ notes: e.target.value })} /></Field>
          </div>
        </div>
      )}
    </Reorder.Item>
  );
}

function Stepper({ value, step, min = 0, onChange }: { value: number; step: number; min?: number; onChange: (v: number) => void }) {
  const set = (v: number) => onChange(Math.max(min, v));
  return (
    <div className="flex h-9 items-center overflow-hidden rounded-md border bg-background" dir="ltr">
      <button type="button" onClick={() => set(value - step)} disabled={value <= min} className="flex h-full w-9 items-center justify-center text-muted-foreground hover:bg-accent disabled:opacity-40" aria-label="-">
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => set(Number(e.target.value) || 0)}
        className="h-full w-full min-w-0 border-x bg-transparent text-center text-sm tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button type="button" onClick={() => set(value + step)} className="flex h-full w-9 items-center justify-center text-muted-foreground hover:bg-accent" aria-label="+">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1"><span className="text-[11px] text-muted-foreground">{label}</span>{children}</div>;
}

/* ---------------- Exercise library (shared by inline browser + bottom sheet) ---------------- */

const MUSCLE_FILTERS: { value: string; ar: string; en: string }[] = [
  { value: "all", ar: "الكل", en: "All" },
  { value: "chest", ar: "صدر", en: "Chest" },
  { value: "back", ar: "ظهر", en: "Back" },
  { value: "shoulders", ar: "أكتاف", en: "Shoulders" },
  { value: "biceps", ar: "بايسبس", en: "Biceps" },
  { value: "triceps", ar: "ترايسبس", en: "Triceps" },
  { value: "legs", ar: "أرجل", en: "Legs" },
  { value: "glutes", ar: "مؤخرة", en: "Glutes" },
  { value: "abs", ar: "بطن", en: "Abs" },
  { value: "cardio", ar: "كارديو", en: "Cardio" },
];

function ExerciseLibraryPanel({
  onPick,
  addedIds,
  gridClassName,
  active = true,
}: {
  onPick: (ex: PickedExercise) => void;
  addedIds?: Set<string>;
  gridClassName: string;
  /** Skip searching while hidden (closed bottom sheet). */
  active?: boolean;
}) {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const [tab, setTab] = useState<"system" | "mine">("system");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  const [results, setResults] = useState<ExercisePickerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [recents, setRecents] = useState<StoredExercise[]>([]);
  const [favorites, setFavorites] = useState<StoredExercise[]>([]);

  // localStorage only exists in the browser — read after mount.
  useEffect(() => {
    setRecents(getRecents());
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    const id = setTimeout(async () => {
      const res = await searchExercisesAction(q, category, tab);
      if (res.ok) setResults(res.data!.items);
      setLoading(false);
    }, 300);
    return () => clearTimeout(id);
  }, [q, category, tab, active]);

  const favIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const pick = (ex: StoredExercise) => {
    onPick(ex);
    setRecents(addRecent(ex));
  };
  const toggleFav = (ex: StoredExercise) => setFavorites(toggleFavorite(ex));
  const showQuickRows = !q.trim();

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {(["system", "mine"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setTab(v)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              tab === v ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-accent",
            )}
          >
            {v === "system" ? L("تمارين النظام", "System exercises") : L("مكتبتي", "My library")}
          </button>
        ))}
      </div>
      <div className="relative">
        <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground start-3" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.dashboard.ui.search} className="ps-9" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {MUSCLE_FILTERS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setCategory(m.value)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              category === m.value ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-accent",
            )}
          >
            {L(m.ar, m.en)}
          </button>
        ))}
      </div>

      {showQuickRows && favorites.length > 0 && (
        <QuickRow title={L("المفضّلة", "Favorites")} icon={<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />} items={favorites} addedIds={addedIds} onPick={pick} />
      )}
      {showQuickRows && recents.length > 0 && (
        <QuickRow title={L("مستخدمة مؤخراً", "Recently used")} icon={<Clock className="h-3.5 w-3.5" />} items={recents} addedIds={addedIds} onPick={pick} />
      )}

      {loading ? (
        <p className="py-6 text-center text-sm text-muted-foreground"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></p>
      ) : results.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">{t.common.noResults}</p>
      ) : (
        <div className={gridClassName}>
          {results.map((ex) => (
            <ExerciseCard
              key={ex.id}
              ex={ex}
              added={addedIds?.has(ex.id) ?? false}
              favorite={favIds.has(ex.id)}
              onPick={() => pick(ex)}
              onToggleFavorite={() => toggleFav(ex)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ExerciseCard({
  ex,
  added,
  favorite,
  onPick,
  onToggleFavorite,
}: {
  ex: ExercisePickerItem;
  added: boolean;
  favorite: boolean;
  onPick: () => void;
  onToggleFavorite: () => void;
}) {
  const { locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const name = locale === "ar" ? ex.nameAr : ex.nameEn;
  return (
    <div className={cn("relative overflow-hidden rounded-lg border transition-colors", added && "border-primary")}>
      <button type="button" onClick={onPick} className="block w-full text-start">
        <div className="relative aspect-video bg-muted">
          <ExerciseMedia
            media={{ videoUrl: ex.videoUrl, youtubeUrl: ex.youtubeUrl, imageUrlStart: ex.imageUrlStart, imageUrlEnd: ex.imageUrlEnd, gifUrl: ex.gifUrl }}
            alt={name}
            className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden"
            iconClassName="h-8 w-8 text-muted-foreground/40"
          />
        </div>
        <div className="space-y-1 p-2">
          <p className="truncate text-xs font-medium sm:text-sm">{name}</p>
          <div className="flex items-center justify-between gap-1">
            <Badge variant="outline" className="truncate px-1.5 text-[10px]">{ex.category}</Badge>
            <span className={cn("flex shrink-0 items-center gap-0.5 text-[11px] font-medium", added ? "text-primary" : "text-muted-foreground")}>
              {added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {added ? L("مُضاف", "Added") : L("إضافة", "Add")}
            </span>
          </div>
        </div>
      </button>
      {added && (
        <span className="pointer-events-none absolute start-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
          <Check className="h-3.5 w-3.5" />
        </span>
      )}
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-label={favorite ? L("إزالة من المفضّلة", "Remove from favorites") : L("أضف للمفضّلة", "Add to favorites")}
        aria-pressed={favorite}
        className="absolute end-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur hover:bg-background"
      >
        <Star className={cn("h-4 w-4", favorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
      </button>
    </div>
  );
}

function QuickRow({
  title,
  icon,
  items,
  addedIds,
  onPick,
}: {
  title: string;
  icon: React.ReactNode;
  items: StoredExercise[];
  addedIds?: Set<string>;
  onPick: (ex: StoredExercise) => void;
}) {
  const { locale } = useI18n();
  return (
    <div className="space-y-1.5">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">{icon}{title}</p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin">
        {items.map((ex) => {
          const added = addedIds?.has(ex.id) ?? false;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => onPick(ex)}
              className={cn("w-28 shrink-0 overflow-hidden rounded-lg border text-start transition-colors hover:bg-accent", added && "border-primary")}
            >
              <div className="relative aspect-video bg-muted">
                <ExerciseMedia
                  media={{ videoUrl: ex.videoUrl, youtubeUrl: ex.youtubeUrl, imageUrlStart: ex.imageUrlStart, imageUrlEnd: ex.imageUrlEnd, gifUrl: ex.gifUrl }}
                  alt={locale === "ar" ? ex.nameAr : ex.nameEn}
                  className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden"
                  iconClassName="h-5 w-5 text-muted-foreground/40"
                />
                {added && (
                  <span className="absolute start-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                )}
              </div>
              <p className="truncate px-1.5 py-1 text-[11px] font-medium">{locale === "ar" ? ex.nameAr : ex.nameEn}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Bottom-sheet exercise picker: tap to add (stays open), ✓ marks what was added this session. */
function ExercisePicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (ex: PickedExercise) => void;
}) {
  const { locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const [addedIds, setAddedIds] = useState<Set<string>>(() => new Set());
  const [count, setCount] = useState(0);

  // Each opening starts a fresh "added this session" tally.
  useEffect(() => {
    if (open) {
      setAddedIds(new Set());
      setCount(0);
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" hideClose className="flex max-h-[88vh] flex-col gap-0 rounded-t-2xl p-0">
        <div className="mx-auto mt-2.5 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/30" aria-hidden />
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 pb-3 pt-3">
          <div className="min-w-0">
            <SheetTitle className="text-base">{L("اختر تمارين", "Pick exercises")}</SheetTitle>
            <SheetDescription className="text-xs">
              {count > 0 ? L(`أُضيف ${count}`, `${count} added`) : L("اضغط على أي تمرين لإضافته", "Tap any exercise to add it")}
            </SheetDescription>
          </div>
          <Button size="sm" onClick={onClose} className="shrink-0 gap-1.5">
            <Check className="h-4 w-4" />{L("تم", "Done")}
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto border-t scrollbar-thin">
          <div className="mx-auto w-full max-w-2xl px-4 py-3">
            <ExerciseLibraryPanel
              active={open}
              onPick={(ex) => {
                onPick(ex);
                setAddedIds((prev) => new Set(prev).add(ex.id));
                setCount((c) => c + 1);
              }}
              addedIds={addedIds}
              gridClassName="grid grid-cols-2 gap-2 sm:grid-cols-3"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
