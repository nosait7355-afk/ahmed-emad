/**
 * Recently-used and favourite exercises for the workout builder, kept in the
 * coach's browser (localStorage) — no backend. Every access is wrapped in
 * try/catch because localStorage can throw (private mode, blocked storage)
 * and must never break the builder.
 *
 * Items store just enough to render a card (name + media), so the rows show
 * without a server round-trip.
 */
import type { ExercisePickerItem } from "@/lib/actions/exercises";

export type StoredExercise = Pick<
  ExercisePickerItem,
  "id" | "nameAr" | "nameEn" | "category" | "videoUrl" | "youtubeUrl" | "imageUrlStart" | "imageUrlEnd" | "gifUrl"
>;

const RECENTS_KEY = "ahmed-emad:recentExercises";
const FAVS_KEY = "ahmed-emad:favExercises";
const MAX_RECENTS = 12;

function read(key: string): StoredExercise[] {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as StoredExercise[]).filter((x) => x && typeof x.id === "string") : [];
  } catch {
    return [];
  }
}

function write(key: string, items: StoredExercise[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    /* storage full or blocked — recents/favourites are a convenience only */
  }
}

function slim(ex: StoredExercise): StoredExercise {
  const { id, nameAr, nameEn, category, videoUrl, youtubeUrl, imageUrlStart, imageUrlEnd, gifUrl } = ex;
  return { id, nameAr, nameEn, category, videoUrl, youtubeUrl, imageUrlStart, imageUrlEnd, gifUrl };
}

export function getRecents(): StoredExercise[] {
  return read(RECENTS_KEY);
}

/** Moves the exercise to the front, de-duplicated, capped at 12. */
export function addRecent(ex: StoredExercise): StoredExercise[] {
  const next = [slim(ex), ...read(RECENTS_KEY).filter((x) => x.id !== ex.id)].slice(0, MAX_RECENTS);
  write(RECENTS_KEY, next);
  return next;
}

export function getFavorites(): StoredExercise[] {
  return read(FAVS_KEY);
}

/** Adds or removes the exercise from favourites; returns the new list. */
export function toggleFavorite(ex: StoredExercise): StoredExercise[] {
  const current = read(FAVS_KEY);
  const next = current.some((x) => x.id === ex.id)
    ? current.filter((x) => x.id !== ex.id)
    : [slim(ex), ...current];
  write(FAVS_KEY, next);
  return next;
}
