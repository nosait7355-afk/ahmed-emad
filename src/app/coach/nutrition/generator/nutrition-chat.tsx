"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  Bot,
  Send,
  Loader2,
  User,
  CheckCircle2,
  AlertTriangle,
  Save,
  PencilLine,
  RotateCcw,
  Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/components/providers/i18n-provider";
import { mealDisplayName } from "@/lib/i18n/labels";
import { nutritionChatAction } from "@/lib/actions/nutrition-generator";
import { CHAT_MESSAGE_MAX } from "@/lib/ai/limits";
import type { EngineFood } from "@/lib/generator/types";
import type { ChatSettings } from "@/lib/ai/nutrition-chat";
import type { GPlan } from "./generator-view";

interface ChatEntry {
  role: "user" | "assistant";
  text: string;
  plan?: GPlan;
  settings?: ChatSettings;
  swapPool?: EngineFood[];
  saveName?: string;
  error?: boolean;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

export function NutritionChat({
  canWrite,
  onOpenPlan,
  onSave,
}: {
  canWrite: boolean;
  /** Load a chat plan into the generator tab (swap, undo, save live there). */
  onOpenPlan: (plan: GPlan, swapPool: EngineFood[], settings: ChatSettings) => void;
  /** Open the save dialog for a plan, optionally with a suggested name. */
  onSave: (plan: GPlan, name: string) => void;
}) {
  const { locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, startSending] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries, sending]);

  /** The newest plan in the conversation — what "change X" refers to. */
  const latest = [...entries].reverse().find((e) => e.plan && e.settings);

  function send(textArg?: string) {
    const text = (textArg ?? draft).trim().slice(0, CHAT_MESSAGE_MAX);
    if (!text || sending) return;
    const next: ChatEntry[] = [...entries, { role: "user", text }];
    setEntries(next);
    setDraft("");
    startSending(async () => {
      const res = await nutritionChatAction({
        // Failed turns aren't real conversation — don't feed them back.
        messages: next.filter((e) => !e.error).map((e) => ({ role: e.role, text: e.text })),
        current:
          latest?.plan && latest.settings
            ? {
                settings: latest.settings,
                meals: latest.plan.meals.map((m) => ({
                  type: m.type,
                  items: m.items.map((it) => ({ food: it.food ?? null, quantity: it.quantity })),
                })),
              }
            : null,
      });
      if (res.ok && res.data) {
        const d = res.data;
        setEntries((prev) => [
          ...prev,
          {
            role: "assistant",
            text: d.reply,
            plan: d.plan as GPlan | undefined,
            settings: d.settings,
            swapPool: d.swapPool,
            saveName: d.saveName,
          },
        ]);
      } else if (!res.ok) {
        setEntries((prev) => [...prev, { role: "assistant", text: res.error, error: true }]);
      }
    });
  }

  const suggestions = [
    L("برنامج 2000 سعرة تنشيف، 4 وجبات", "2000 kcal weight-loss plan, 4 meals"),
    L("برنامج تضخيم 3000 سعرة، 5 وجبات، بيحب البيض الصبح", "3000 kcal muscle-gain plan, 5 meals, likes eggs at breakfast"),
    L("برنامج 1800 سعرة لو كارب، مابيحبش السمك", "1800 kcal low-carb plan, no fish"),
  ];

  return (
    <Card className="flex min-h-[70vh] flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4 text-primary" />
          {L("مساعد التغذية", "Nutrition assistant")}
        </CardTitle>
        {entries.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1"
            disabled={sending}
            onClick={() => setEntries([])}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {L("محادثة جديدة", "New chat")}
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex-1 space-y-3 overflow-y-auto">
          {entries.length === 0 && (
            <div className="space-y-3 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                {L(
                  "اكتب المواصفات اللي عايزها وأنا أعملك البرنامج من مكتبة أطعمتك — وبعدها تقدر تطلب أي تعديل بالكلام.",
                  "Describe what you need and I'll build the plan from your food library — then ask for any change in plain words.",
                )}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={!canWrite || sending}
                    onClick={() => send(s)}
                    className="rounded-full border border-border/70 px-3 py-1.5 text-xs transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {entries.map((e, i) => (
            <div key={i} className={`flex gap-2 ${e.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  e.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {e.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
              </div>
              <div className="min-w-0 max-w-[90%] space-y-2">
                <div
                  dir="auto"
                  className={`whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    e.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : e.error
                        ? "border border-destructive/50 text-destructive"
                        : "bg-muted"
                  }`}
                >
                  {e.text}
                </div>

                {e.plan && e.settings && (
                  <ChatPlanCard
                    plan={e.plan}
                    canWrite={canWrite}
                    isLatest={e === latest}
                    onOpen={() => onOpenPlan(e.plan!, e.swapPool ?? [], e.settings!)}
                    onSave={() => onSave(e.plan!, "")}
                  />
                )}

                {e.saveName && latest?.plan && (
                  <Button
                    size="sm"
                    className="gap-1.5"
                    disabled={!canWrite}
                    onClick={() => onSave(latest.plan!, e.saveName!)}
                  >
                    <Save className="h-3.5 w-3.5" />
                    {L(`حفظ باسم «${e.saveName}»`, `Save as “${e.saveName}”`)}
                  </Button>
                )}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {L("بيجهّز… ممكن ياخد لحد دقيقة", "Working… can take up to a minute")}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="space-y-1.5 border-t pt-3">
          <div className="flex items-end gap-2">
            <textarea
              dir="auto"
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, CHAT_MESSAGE_MAX))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              disabled={!canWrite}
              placeholder={
                latest
                  ? L("اطلب تعديل… مثلاً: غيّر العشا لحاجة أخف", "Ask for a change… e.g. make dinner lighter")
                  : L("مثلاً: برنامج 2200 سعرة تضخيم، 5 وجبات، مابيحبش الفراخ", "e.g. 2200 kcal muscle gain, 5 meals, no chicken")
              }
              className="flex min-h-[44px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              size="icon"
              className="h-11 w-11 shrink-0"
              onClick={() => send()}
              disabled={!canWrite || sending || !draft.trim()}
              aria-label={L("إرسال", "Send")}
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 rtl:-scale-x-100" />}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {L(
              "الأكلات من مكتبتك فقط، والجرامات محسوبة بدقة. المحادثة لا تُحفظ — احفظ البرنامج كقالب. لا تكتب اسم العميل أو بياناته.",
              "Foods come only from your library and grams are exact. The chat isn't saved — save the plan as a template. Don't include client names or details.",
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ChatPlanCard({
  plan,
  canWrite,
  isLatest,
  onOpen,
  onSave,
}: {
  plan: GPlan;
  canWrite: boolean;
  isLatest: boolean;
  onOpen: () => void;
  onSave: () => void;
}) {
  const { t, locale } = useI18n();
  const L = (ar: string, en: string) => (locale === "ar" ? ar : en);

  return (
    <div className={`space-y-2 rounded-xl border p-3 ${isLatest ? "border-primary/40" : "opacity-80"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex flex-wrap items-center gap-1 text-sm font-semibold">
          <Flame className="h-3.5 w-3.5 text-primary" />
          {r1(plan.totals.calories)} {t.client.calories}
          <span className="font-normal text-muted-foreground">
            {" · "}
            {t.client.protein} {r1(plan.totals.protein)}g · {t.client.carbs} {r1(plan.totals.carbs)}g · {t.client.fat}{" "}
            {r1(plan.totals.fat)}g
          </span>
        </p>
        {plan.withinTolerance ? (
          <Badge className="gap-1 bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15">
            <CheckCircle2 className="h-3 w-3" />
            {L("ضمن الهدف ±٣٪", "On target ±3%")}
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1 text-amber-600">
            <AlertTriangle className="h-3 w-3" />
            {L("قريب من الهدف", "Close to target")}
          </Badge>
        )}
      </div>

      <div className="space-y-1.5">
        {plan.meals.map((meal, mi) => (
          <div key={mi} className="text-sm">
            <span className="font-medium">{mealDisplayName(meal, locale)}: </span>
            <span className="text-muted-foreground">
              {meal.items.length === 0
                ? "—"
                : meal.items
                    .map((it) => `${locale === "ar" ? it.nameAr : it.nameEn} ${it.quantity}g`)
                    .join(locale === "ar" ? "، " : ", ")}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={onOpen}>
          <PencilLine className="h-3.5 w-3.5" />
          {L("فتح للتعديل والاستبدال", "Open to edit & swap")}
        </Button>
        <Button size="sm" variant="outline" className="h-8 gap-1.5" disabled={!canWrite} onClick={onSave}>
          <Save className="h-3.5 w-3.5" />
          {L("حفظ كقالب", "Save as template")}
        </Button>
      </div>
    </div>
  );
}
