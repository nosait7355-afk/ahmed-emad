import { perGram } from "@/lib/generator/engine";
import type { EngineFood } from "@/lib/generator/types";

/**
 * Compact one-line food format for AI prompts. The whole library goes into
 * every request, so every character counts against the free-tier quota and
 * latency: Arabic name only, short meal codes, macros per 100g as k/p/c/f.
 */
export const FOOD_LINE_HEADER =
  "FOOD LIBRARY — one per line: number|name|category|meals (b=breakfast l=lunch d=dinner s=snack, *=any)|priority 1-5|per 100g kcal/protein/carbs/fat";

const MEAL_CODE: Record<string, string> = { breakfast: "b", lunch: "l", dinner: "d", snack: "s" };
const r0 = (n: number) => Math.round(n);

export function formatFoodLine(f: EngineFood, i: number): string {
  const pg = perGram(f);
  const meals = f.meals.length ? f.meals.map((m) => MEAL_CODE[m] ?? m).join("") : "*";
  return `${i}|${f.nameAr}|${f.category}|${meals}|${f.priority}|${r0(pg.calories * 100)}/${r0(pg.protein * 100)}/${r0(pg.carbs * 100)}/${r0(pg.fat * 100)}`;
}
