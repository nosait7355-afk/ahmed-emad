import { z } from "zod";
import { geminiJson, AiError } from "./gemini";
import { dietAllows } from "@/lib/generator/engine";
import { CLIENT_CONTEXT, FOOD_LINE_HEADER, formatFoodLine } from "./food-lines";
import {
  DEFAULT_RATIOS,
  MEAL_COMPOSITION,
  MEALS_PER_DAY_SEQUENCE,
  SNACK_ROTATION,
} from "@/lib/generator/config";
import type { EngineFood, GeneratorInput } from "@/lib/generator/types";

import { AI_NOTES_MAX } from "./limits";

const SYSTEM = `You are a sports nutritionist helping a fitness coach build a one-day meal plan.
You may ONLY use foods from the numbered library you are given — refer to them by their number.
Pick the foods for each meal; do NOT give grams or quantities (they are calculated afterwards).
Rules:
- 2 to 4 foods per meal; every main meal needs a real protein source and, unless low-carb, a real starch (rice, bread, oats, potatoes, pasta, beans). Honey, jam and sugar are small extras only, never the meal's carb source.
- Respect each food's allowed meals when listed, and pick foods that make sense together (realistic Egyptian/Arab meals).
- Prefer higher-priority foods (priority 5 = coach's favourite) and vary foods across the day.
- Choose foods whose macros can reach the target split (e.g. lean proteins for high-protein goals, fewer starches for low-carb).
- Follow the coach's notes strictly (dislikes, allergies, preferences) — they override every other rule.`;

const responseSchema = {
  type: "OBJECT",
  properties: {
    meals: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          meal: { type: "INTEGER" },
          foods: { type: "ARRAY", items: { type: "INTEGER" } },
        },
        required: ["meal", "foods"],
      },
    },
  },
  required: ["meals"],
};

const responseShape = z.object({
  meals: z.array(
    z.object({
      meal: z.number().int(),
      foods: z.array(z.number().int()).max(8),
    }),
  ),
});

const r0 = (n: number) => Math.round(n);

/**
 * Ask the AI which library foods go in each meal. Returns food ids per meal,
 * index-aligned with the engine's meal sequence, for `generatePlan`'s
 * `selection` argument. Only ids from `pool` can come back: the model sees
 * short numbers, and any number outside the list is dropped here.
 *
 * Nothing that identifies a client is sent — only the targets, the food
 * library, and the coach's notes.
 */
export async function pickFoodsWithAi(
  pool: EngineFood[],
  input: GeneratorInput,
  notes: string,
): Promise<string[][]> {
  const foods = pool.filter((f) => dietAllows(f, input.goal));
  if (foods.length === 0) return [];

  const sequence = MEALS_PER_DAY_SEQUENCE[input.mealsPerDay] ?? MEALS_PER_DAY_SEQUENCE[3];
  const ratio = { ...DEFAULT_RATIOS[input.goal], ...(input.ratio ?? {}) };

  let snack = 0;
  const mealLines = sequence.map((type, i) => {
    const cats =
      type === "snack"
        ? [SNACK_ROTATION[snack % 3], SNACK_ROTATION[(snack++ + 1) % 3]]
        : MEAL_COMPOSITION[type];
    return `${i}: ${type} (suggested categories: ${cats.join(", ")})`;
  });

  const foodLines = foods.map((f, i) => formatFoodLine(f, i));

  const prompt = [
    `Goal: ${input.goal}. Daily calories: ${input.calories}.`,
    `Macro split (% of calories): protein ${r0(ratio.protein ?? 0)}, carbs ${r0(ratio.carbs ?? 0)}, fat ${r0(ratio.fat ?? 0)}.`,
    `Variation #${input.seed ?? 0} — if this number is above 0, choose a noticeably different combination than the obvious one.`,
    "",
    "Meals (index: type):",
    ...mealLines,
    "",
    "Coach notes:",
    notes.trim() ? notes.trim().slice(0, AI_NOTES_MAX) : "(none)",
    "",
    CLIENT_CONTEXT,
    "",
    FOOD_LINE_HEADER,
    ...foodLines,
    "",
    `Return one entry per meal index (0 to ${sequence.length - 1}) with the food numbers you chose.`,
  ].join("\n");

  const raw = await geminiJson({
    system: SYSTEM,
    prompt,
    responseSchema,
    temperature: (input.seed ?? 0) > 0 ? 1 : 0.6,
  });
  const parsed = responseShape.safeParse(raw);
  if (!parsed.success) throw new AiError("AI response had the wrong shape", "BAD_RESPONSE");

  const selection: string[][] = sequence.map(() => []);
  for (const m of parsed.data.meals) {
    if (m.meal < 0 || m.meal >= sequence.length) continue;
    for (const n of m.foods) {
      const food = foods[n];
      if (food && !selection[m.meal].includes(food.id)) selection[m.meal].push(food.id);
    }
  }
  return selection;
}
