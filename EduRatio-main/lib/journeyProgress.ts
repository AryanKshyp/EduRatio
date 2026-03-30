/**
 * Client-side persistence for learning-path mastery (0–1), derived from chapter quiz performance.
 */

import { SUBTOPICS } from "@/lib/content";

export const JOURNEY_STORAGE_KEY = "eduratio-journey-v1";
export const JOURNEY_UNLOCK_MAX_INDEX_KEY = "eduratio-unlocked-max-index-v1";
export const MASTERY_UPDATED_EVENT = "eduratio-mastery-updated" as const;

type JourneyV1 = {
  mastery: Record<string, number>;
};

function emptyMastery(): Record<string, number> {
  return {};
}

export function getJourneyMastery(): Record<string, number> {
  if (typeof window === "undefined") return emptyMastery();
  try {
    const raw = localStorage.getItem(JOURNEY_STORAGE_KEY);
    if (!raw) return emptyMastery();
    const data = JSON.parse(raw) as JourneyV1;
    return typeof data.mastery === "object" && data.mastery !== null ? data.mastery : emptyMastery();
  } catch {
    return emptyMastery();
  }
}

export function setJourneyMastery(next: Record<string, number>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify({ mastery: next }));
  window.dispatchEvent(new CustomEvent(MASTERY_UPDATED_EVENT, { detail: next }));
}

function getUnlockedMaxIndex(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(JOURNEY_UNLOCK_MAX_INDEX_KEY);
  const n = raw ? Number(raw) : 0;
  if (!Number.isFinite(n)) return 0;
  return Math.min(SUBTOPICS.length - 1, Math.max(0, Math.floor(n)));
}

function setUnlockedMaxIndex(nextIndex: number): void {
  if (typeof window === "undefined") return;
  const cur = getUnlockedMaxIndex();
  const next = Math.min(SUBTOPICS.length - 1, Math.max(cur, Math.floor(nextIndex)));
  localStorage.setItem(JOURNEY_UNLOCK_MAX_INDEX_KEY, String(next));
}

/**
 * Update one topic: stored value is the max of previous and `value` (so retries don't erase a high score).
 */
export function mergeSubtopicMastery(subtopicId: string, value: number): void {
  const clamped = Math.min(1, Math.max(0, value));
  const cur = getJourneyMastery();
  const prev = cur[subtopicId] ?? 0;
  const merged = Math.max(prev, clamped);
  setJourneyMastery({ ...cur, [subtopicId]: merged });
  if (merged >= UNLOCK_PREV_MASTERY_MIN) {
    const idx = SUBTOPICS.findIndex((t) => t.id === subtopicId);
    if (idx >= 0) setUnlockedMaxIndex(idx + 1);
  }
}

/** Threshold on prev topic's mastery to unlock the next island (quiz-performance based). */
export const UNLOCK_PREV_MASTERY_MIN = 0.8;

export function isSubtopicUnlocked(subtopicId: string): boolean {
  const idx = SUBTOPICS.findIndex((t) => t.id === subtopicId);
  if (idx <= 0) return true;
  if (idx <= getUnlockedMaxIndex()) return true;
  const prevId = SUBTOPICS[idx - 1]!.id;
  const m = getJourneyMastery();
  return (m[prevId] ?? 0) >= UNLOCK_PREV_MASTERY_MIN;
}

/** True if the learner has cleared at least one chapter quiz at the unlock threshold (e.g. 80%). */
export function hasCompletedAtLeastOneChapter(): boolean {
  const m = getJourneyMastery();
  return SUBTOPICS.some((t) => (m[t.id] ?? 0) >= UNLOCK_PREV_MASTERY_MIN);
}

/** True when every configured subtopic has mastery >= unlock threshold. */
export function hasMasteredAllSubtopics(): boolean {
  const m = getJourneyMastery();
  return SUBTOPICS.every((t) => (m[t.id] ?? 0) >= UNLOCK_PREV_MASTERY_MIN);
}
