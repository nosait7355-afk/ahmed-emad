import { perGram } from "@/lib/generator/engine";
import type { EngineFood } from "@/lib/generator/types";

/**
 * Compact one-line food format for AI prompts. The whole library goes into
 * every request, so every character counts against the free-tier quota and
 * latency: Arabic name only, short meal codes, macros per 100g as k/p/c/f.
 */
export const FOOD_LINE_HEADER =
  "FOOD LIBRARY — one per line: number|name|category|meals (b=breakfast l=lunch d=dinner s=snack, *=any)|priority 1-5|per 100g kcal/protein/carbs/fat";

/**
 * Who the plans are for, sent right before the library in every prompt. The
 * coach's clients are Egyptian, so meals should look like what people in
 * Egypt actually eat and can buy, not generic "fitness" food.
 */
export const CLIENT_CONTEXT = `CLIENT CONTEXT: The client is Egyptian and lives in Egypt.
- Build meals an Egyptian would actually eat day to day: e.g. foul, eggs, baladi bread, white cheese (gebna), falafel (ta'meya) for breakfast; rice, pasta, potatoes, molokhia, grilled meat, fish or liver for lunch; yogurt, cottage cheese, fruit, light sandwiches for dinner and snacks.
- Prefer foods that are common, affordable and easy to find in Egyptian supermarkets and markets; avoid rare imported items unless the coach asks for them.
- Combine foods the way Egyptians do (bread with foul or cheese, rice with protein and salad), and follow Egyptian meal timing: lunch is the main, biggest meal.`;

const MEAL_CODE: Record<string, string> = { breakfast: "b", lunch: "l", dinner: "d", snack: "s" };
const r0 = (n: number) => Math.round(n);

export function formatFoodLine(f: EngineFood, i: number): string {
  const pg = perGram(f);
  const meals = f.meals.length ? f.meals.map((m) => MEAL_CODE[m] ?? m).join("") : "*";
  return `${i}|${f.nameAr}|${f.category}|${meals}|${f.priority}|${r0(pg.calories * 100)}/${r0(pg.protein * 100)}/${r0(pg.carbs * 100)}/${r0(pg.fat * 100)}`;
}
