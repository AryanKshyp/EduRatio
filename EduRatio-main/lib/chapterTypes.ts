/**
 * Shared shape for full-width chapter pages (lessons + flash cards + quiz).
 */

export type LessonAccent = "teal" | "coral" | "violet" | "sun";

export type ChapterLesson = {
  id: string;
  accent: LessonAccent;
  sectionKey: string;
  teachTitle: string;
  teachBlocks: string[];
  formulaLines?: string[];
  signRules?: { combo: string; result: string }[];
  warning?: string;
  flash: {
    label: string;
    problem: string;
    tableHeader: { step: string; working: string };
    rows: { step: string; working: string }[];
    answerLine: string;
  };
};

export type ChapterQuizItem =
  | {
      id: string;
      kind: "fraction";
      prompt: string;
      accepted: string[];
      hints: [string, string, string];
      remedial: string;
    }
  | {
      id: string;
      kind: "mcq";
      prompt: string;
      options: [string, string, string, string];
      correctIndex: number;
      hints: [string, string, string];
      remedial: string;
    };

export type ChapterDomainIntro = {
  heading: string;
  definition: string;
  bridge: string;
  objectives: readonly string[];
  prerequisite: string;
};

export type ChapterHero = {
  title: string;
  chapterLabel: string;
};

export type ChapterBundle = {
  id: string;
  hero: ChapterHero;
  domainIntro: ChapterDomainIntro;
  lessons: ChapterLesson[];
  quiz: ChapterQuizItem[];
  /**
   * Optional content shown right before the quiz starts (e.g. a blackboard-style summary).
   * When present, the UI can display it before the first question.
   */
  preQuizSummary?: {
    heading: string;
    lines: readonly string[];
  };
};

/** Dispatched on window when a chapter quiz block is fully completed. */
export const QUIZ_COMPLETE_EVENT = "eduratio-quiz-complete" as const;

export type QuizCompleteDetail = {
  subtopicId: string;
  chapterLabel: string;
};

/**
 * When the learner returns to the journey map after a quiz that unlocked the next island,
 * sessionStorage holds `{ fromIndex }` (segment `fromIndex` → `fromIndex + 1` on the path).
 */
export const UNLOCK_FLIGHT_STORAGE_KEY = "eduratio-pending-unlock-flight" as const;
