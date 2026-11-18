import { z } from "zod";
import { geminiJson, AiError } from "./gemini";
import { generatePlan } from "@/lib/generator/engine";
import { CLIENT_CONTEXT, FOOD_LINE_HEADER, formatFoodLine } from "./food-lines";
import { MEALS_PER_DAY_SEQUENCE } from "@/lib/generator/config";
import { GENERATOR_GOALS, type GeneratorGoal } from "@/lib/constants";
import type { EngineFood, GeneratedPlan, MacroRatio } from "@/lib/generator/types";
import { CHAT_HISTORY_MAX, CHAT_MESSAGE_MAX } from "./limits";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export interface ChatSettings {
  calories: number;
  goal: GeneratorGoal;
  mealsPerDay: number;
  /** Custom macro split; absent means the goal's default. */
  ratio?: MacroRatio;
}

/** The plan currently on screen, as the client sends it back each turn. */
export interface ChatCurrentPlan {
  settings: ChatSettings;
  meals: { type: string; items: { food?: string | null; quantity: number }[] }[];
}

export interface ChatTurnResult {
  reply: string;
  /** Present when this turn built or changed the plan. */
  plan?: GeneratedPlan;
  settings?: ChatSettings;
  /** Present when the coach asked to save; the client confirms before saving. */
  saveName?: string;
}

const DEFAULT_SETTINGS: ChatSettings = { calories: 2000, goal: "balanced", mealsPerDay: 4 };

const SYSTEM_RULES = `You are the nutrition assistant inside a fitness coach's app. The coach chats with you (usually in Egyptian Arabic) to build a one-day meal plan for a client.

How you work:
- You choose WHICH foods go in each meal, using ONLY the numbered food library below (refer to foods by number).
- The app then calculates every gram, calorie and macro exactly. You never state grams, calories or macro numbers for foods — you don't know them yet.
- Each turn, answer with JSON: a short "reply" to the coach, and an "action":
  - "plan": build a new plan or change the current one. Always return the FULL plan (every meal with its food numbers) plus the full settings. For a change ("lighter dinner", "swap the rice"), keep everything the coach didn't ask to change.
  - "save": the coach asked to save the current plan as a template; put the name in "templateName" (in the coach's words, or a short descriptive name). You cannot save by yourself — reply that the save button is ready and they should press it to confirm.
  - "none": just talking, answering a question, or you need more info first.
- If the coach hasn't given daily calories for a new plan, ask for it (action "none"). Goal defaults to balanced and meals to 4 if not mentioned.
- Settings: calories 1000-5000; mealsPerDay 3-6; goal one of: ${GENERATOR_GOALS.join(", ")}. To shift macros ("more protein", "low carb") set protein/carbs/fat as percentages summing to 100; otherwise leave them 0 to use the goal default.
- Goal words: تنشيف / خسارة وزن = weight_loss; تضخيم / ضخامة / زيادة عضل = muscle_gain; تثبيت = maintain; متوازن = balanced; بروتين عالي = high_protein; لو كارب / قليل الكارب = low_carb; نباتي = vegetarian; فيجان = vegan.
- Each entry in "meals" has "meal" (index) and "type". Indexes per mealsPerDay:
  3 → 0 breakfast, 1 lunch, 2 dinner
  4 → 0 breakfast, 1 snack, 2 lunch, 3 dinner
  5 → 0 breakfast, 1 snack, 2 lunch, 3 snack, 4 dinner
  6 → 0 breakfast, 1 snack, 2 lunch, 3 snack, 4 dinner, 5 snack
  Breakfast foods go in breakfast, not in a snack.
- 2 to 4 foods per meal. Every main meal (breakfast, lunch, dinner) has a real protein source AND, unless low-carb, a real starch (rice, bread, oats, potatoes, pasta, beans). Honey, jam, sugar and sauces are small extras only, never the meal's carb source. Respect each food's allowed meals; prefer higher priority (5 = coach's favourite); vary foods across the day; make realistic Egyptian/Arab meals.
- Strictly follow dislikes, allergies and preferences the coach mentions anywhere in the conversation.
- Reply in the coach's language and dialect, 1-3 short sentences: say what you did or ask what you need. The plan itself is shown to the coach separately, so don't list it.
- Never ask for or repeat the client's name, phone or personal details.`;

const responseSchema = {
  type: "OBJECT",
  properties: {
    reply: { type: "STRING" },
    action: { type: "STRING", enum: ["none", "plan", "save"] },
    settings: {
      type: "OBJECT",
      properties: {
        calories: { type: "INTEGER" },
        goal: { type: "STRING", enum: [...GENERATOR_GOALS] },
        mealsPerDay: { type: "INTEGER" },
        protein: { type: "INTEGER" },
        carbs: { type: "INTEGER" },
        fat: { type: "INTEGER" },
      },
    },
    meals: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          meal: { type: "INTEGER" },
          type: { type: "STRING", enum: ["breakfast", "lunch", "dinner", "snack"] },
          foods: { type: "ARRAY", items: { type: "INTEGER" } },
        },
        required: ["meal", "type", "foods"],
      },
    },
    templateName: { type: "STRING" },
  },
  required: ["reply", "action"],
};

const responseShape = z.object({
  reply: z.string(),
  action: z.enum(["none", "plan", "save"]),
  settings: z
    .object({
      calories: z.number().optional(),
      goal: z.string().optional(),
      mealsPerDay: z.number().optional(),
      protein: z.number().optional(),
      carbs: z.number().optional(),
      fat: z.number().optional(),
    })
    .optional(),
  meals: z
    .array(
      z.object({
        meal: z.number().int(),
        type: z.string().optional(),
        foods: z.array(z.number().int()).max(8),
      }),
    )
    .optional(),
  templateName: z.string().optional(),
});

const r0 = (n: number) => Math.round(n);

/**
 * Goal keywords in the coach's own words. The Lite model often returns the
 * "balanced" default even when its reply says "muscle gain", so an explicit
 * word from the coach wins over that default. Most specific phrases first.
 */
const GOAL_KEYWORDS: [GeneratorGoal, RegExp][] = [
  ["vegan", /فيجان|vegan/i],
  ["vegetarian", /نباتي|vegetarian/i],
  ["low_carb", /لو ?كارب|قليل الكارب|كيتو|low.?carb|keto/i],
  ["high_protein", /بروتين عالي|عالي البروتين|high.?protein/i],
  ["weight_loss", /تنشيف|خسارة (ال)?وزن|تخسيس|weight.?loss|\bcut(ting)?\b/i],
  ["muscle_gain", /تضخيم|ضخامة|زيادة (ال)?عضل|بناء (ال)?عضل|muscle.?gain|\bbulk(ing)?\b/i],
  ["maintain", /تثبيت|maintain/i],
];

/** The goal the coach stated most recently in the conversation, if any. */
function goalFromCoach(messages: ChatMessage[]): GeneratorGoal | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== "user") continue;
    const hit = GOAL_KEYWORDS.find(([, re]) => re.test(messages[i].text));
    if (hit) return hit[0];
  }
  return undefined;
}

/** Merge the model's settings over the current ones, clamped to sane values. */
function resolveSettings(
  raw: z.infer<typeof responseShape>["settings"],
  base: ChatSettings,
  coachGoal: GeneratorGoal | undefined,
): ChatSettings {
  const calories = raw?.calories && raw.calories > 0 ? raw.calories : base.calories;
  const meals = raw?.mealsPerDay ?? base.mealsPerDay;
  const modelGoal = GENERATOR_GOALS.includes(raw?.goal as GeneratorGoal)
    ? (raw!.goal as GeneratorGoal)
    : undefined;
  const goal =
    modelGoal && !(modelGoal === "balanced" && coachGoal)
      ? modelGoal
      : (coachGoal ?? modelGoal ?? base.goal);
  const p = raw?.protein ?? 0;
  const c = raw?.carbs ?? 0;
  const f = raw?.fat ?? 0;
  const hasRatio = p > 0 && c > 0 && f > 0;
  return {
    calories: Math.min(5000, Math.max(1000, Math.round(calories / 50) * 50)),
    goal,
    mealsPerDay: Math.min(6, Math.max(3, Math.round(meals))),
    // A goal change without new percentages drops the old custom split.
    ratio: hasRatio
      ? { protein: p, carbs: c, fat: f }
      : goal === base.goal
        ? base.ratio
        : undefined,
  };
}

/**
 * One chat turn: one Gemini call that reads the conversation, the food library
 * and the plan on screen, then either talks, (re)builds the plan, or asks to
 * save. When it builds, the engine solves every gram from the chosen foods.
 */
export async function runNutritionChat(
  poolUnsorted: EngineFood[],
  messages: ChatMessage[],
  current: ChatCurrentPlan | null,
): Promise<ChatTurnResult> {
  // Stable numbering across turns: the model refers to foods by these numbers.
  const pool = [...poolUnsorted].sort((a, b) => a.id.localeCompare(b.id));
  const indexById = new Map(pool.map((f, i) => [f.id, i]));
  const byId = new Map(pool.map((f) => [f.id, f]));

  const foodLines = pool.map((f, i) => formatFoodLine(f, i));

  let currentBlock = "No plan yet.";
  if (current) {
    const s = current.settings;
    const ratio = s.ratio
      ? `protein ${r0(s.ratio.protein)}% carbs ${r0(s.ratio.carbs)}% fat ${r0(s.ratio.fat)}%`
      : "goal default";
    const lines = current.meals.map((m, i) => {
      const items = m.items
        .map((it) => {
          const idx = it.food ? indexById.get(it.food) : undefined;
          const f = it.food ? byId.get(it.food) : undefined;
          return idx == null || !f ? null : `#${idx} ${f.nameAr} (${r0(it.quantity)}g)`;
        })
        .filter(Boolean)
        .join(", ");
      return `${i} ${m.type}: ${items || "(empty)"}`;
    });
    currentBlock = [
      `Settings: calories ${s.calories}, goal ${s.goal}, mealsPerDay ${s.mealsPerDay}, macros ${ratio}.`,
      ...lines,
    ].join("\n");
  }

  const system = [
    SYSTEM_RULES,
    "",
    "CURRENT PLAN ON SCREEN:",
    currentBlock,
    "",
    CLIENT_CONTEXT,
    "",
    FOOD_LINE_HEADER,
    ...foodLines,
  ].join("\n");

  const recent = messages
    .slice(-CHAT_HISTORY_MAX)
    .map((m) => ({ ...m, text: m.text.slice(0, CHAT_MESSAGE_MAX) }));
  const last = recent.pop();
  if (!last || last.role !== "user") {
    return { reply: "اكتب طلبك وأنا أجهزلك البرنامج." };
  }

  const raw = await geminiJson({
    system,
    prompt: last.text,
    history: recent.map((m) => ({ role: m.role === "user" ? "user" : "model", text: m.text })),
    responseSchema,
    temperature: 0.7,
  });
  const parsed = responseShape.safeParse(raw);
  if (!parsed.success) throw new AiError("Chat response had the wrong shape", "BAD_RESPONSE");
  const out = parsed.data;
  const reply = out.reply.trim() || "تمام.";

  if (out.action === "save") {
    if (!current) return { reply: "لسه مفيش برنامج أحفظه — قولي المواصفات الأول." };
    return { reply, saveName: (out.templateName ?? "").trim().slice(0, 80) || "قالب من المساعد" };
  }

  if (out.action !== "plan") return { reply };

  const settings = resolveSettings(
    out.settings,
    current?.settings ?? DEFAULT_SETTINGS,
    goalFromCoach(messages),
  );
  const sequence = MEALS_PER_DAY_SEQUENCE[settings.mealsPerDay];
  // Trust the meal's stated type over its index: the model sometimes shifts
  // indexes (breakfast foods landing in slot 1). Each entry goes to the slot
  // whose type matches — its own index if that fits, else the first free one.
  const selection: string[][] = sequence.map(() => []);
  const taken = new Set<number>();
  const entries = (out.meals ?? []).filter((m) => m.foods.length > 0);
  const slotFor = (m: (typeof entries)[number]): number => {
    const type = m.type as string | undefined;
    const indexOk = m.meal >= 0 && m.meal < sequence.length && !taken.has(m.meal);
    if (!type || !sequence.includes(type as never)) return indexOk ? m.meal : -1;
    if (indexOk && sequence[m.meal] === type) return m.meal;
    const free = sequence.findIndex((t, i) => t === type && !taken.has(i));
    return free >= 0 ? free : indexOk ? m.meal : -1;
  };
  for (const m of entries) {
    const slot = slotFor(m);
    if (slot < 0) continue;
    taken.add(slot);
    for (const n of m.foods) {
      const food = pool[n];
      if (food && !selection[slot].includes(food.id)) selection[slot].push(food.id);
    }
  }

  const input = {
    calories: settings.calories,
    goal: settings.goal,
    mealsPerDay: settings.mealsPerDay,
    ratio: settings.ratio,
  };
  const fresh = generatePlan(pool, input, selection);

  // An edit like "lighter dinner" with the same settings: meals whose foods
  // didn't change keep their exact portions and only the edited meals are
  // re-solved. If that can't land on target, the full re-solve wins.
  const locks = current && sameSettings(current.settings, settings)
    ? unchangedMealLocks(current, selection)
    : null;
  if (locks) {
    const kept = generatePlan(pool, input, selection, locks);
    if (kept.withinTolerance || !fresh.withinTolerance) return { reply, plan: kept, settings };
  }
  return { reply, plan: fresh, settings };
}

function sameSettings(a: ChatSettings, b: ChatSettings): boolean {
  const ra = a.ratio;
  const rb = b.ratio;
  const sameRatio =
    (!ra && !rb) ||
    (!!ra && !!rb && ra.protein === rb.protein && ra.carbs === rb.carbs && ra.fat === rb.fat);
  return (
    a.calories === b.calories && a.goal === b.goal && a.mealsPerDay === b.mealsPerDay && sameRatio
  );
}

/**
 * Locks for every meal whose food set is identical to the current plan's same
 * meal. Null when nothing (or everything) is unchanged — nothing to keep apart.
 */
function unchangedMealLocks(
  current: ChatCurrentPlan,
  selection: string[][],
): Record<string, number> | null {
  const locks: Record<string, number> = {};
  let unchanged = 0;
  selection.forEach((ids, i) => {
    const before = current.meals[i]?.items.filter((it) => it.food) ?? [];
    const same =
      ids.length > 0 &&
      ids.length === before.length &&
      ids.every((id) => before.some((it) => it.food === id));
    if (!same) return;
    unchanged++;
    for (const it of before) if (it.food && it.quantity > 0) locks[`${i}:${it.food}`] = it.quantity;
  });
  return unchanged > 0 && unchanged < selection.length ? locks : null;
}
