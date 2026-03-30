/** Corner-bubble and default panel copy for Pen. */

import { SUBTOPICS } from "@/lib/content";

export const PEN_BUBBLE_HI = "Hey, I'm Pen! ";

/** First visit / course start on the home dashboard (no chapter cleared yet). */
export const COURSE_WELCOME_BUBBLE =
  "Welcome! I am Pen. Let's study rational numbers.";

/** Dashboard after the learner has cleared at least one chapter (80%+ quiz). */
export const MAP_HELP_BUBBLE =
  "Keep going!";

export function chapterLetsBeginBubble(subtopicId: string): string {
  const topic = SUBTOPICS.find((s) => s.id === subtopicId);
  const label = topic?.title ?? "this chapter";
  return `So let's begin with ${label}.`;
}

export function quizCompleteBubble(chapterLabel: string): string {
  return `Wow! You did a great job in ${chapterLabel}. Now let's move to the next topic.`;
}

/** Default copy for Pen's chat panel by subtopic (API context / hints). */
export const DEFAULT_WELCOME_BY_SUBTOPIC: Record<string, string> = {
  operations:
    PEN_BUBBLE_HI +
    "I'm tuned to Chapter 1 (Operations) — ask for Explain, hints, or remedial help on rational arithmetic.",
  "number-line":
    PEN_BUBBLE_HI + "Chapter 2 (Number line) — plotting, comparing, and distances on the line.",
  properties: PEN_BUBBLE_HI + "Chapter 3 (Properties) — commutativity, associativity, distributivity.",
  identities: PEN_BUBBLE_HI + "Chapter 4 (Identities) — zero and one in rational arithmetic.",
  inverses: PEN_BUBBLE_HI + "Chapter 5 (Inverses) — opposites and reciprocals.",
  "numbers-between": PEN_BUBBLE_HI + "Chapter 6 (Numbers between) — averages, density, and gaps on the line.",
};

export function defaultPenWelcome(subtopicId: string): string {
  return DEFAULT_WELCOME_BY_SUBTOPIC[subtopicId] ?? DEFAULT_WELCOME_BY_SUBTOPIC.operations;
}
