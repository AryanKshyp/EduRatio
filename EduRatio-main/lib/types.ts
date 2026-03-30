export type Difficulty = "easy" | "medium" | "hard";
export type SessionStatus = "active" | "completed" | "exited";
export type PedagogyResponseCase = "correct_fast" | "correct_slow" | "incorrect";
export type HintLevel = 0 | 1 | 2 | 3;
export type RemediationStage = "L1" | "L2" | "escalation";

export interface LearnerSignals {
  attempts: number[];
  hint_usage: HintLevel[];
  error_patterns: string[];
  time_on_task: number[];
  remedial_done: 0 | 1 | 2;
}

export interface MasteryComponents {
  attemptEfficiency: number;
  independenceScore: number;
  errorComponent: number;
  timeEngagement: number;
  remedialMultiplier: number;
  raw: number;
  mastery: number;
}

export interface SessionMetrics {
  correct_answers: number;
  wrong_answers: number;
  questions_attempted: number;
  retry_count: number;
  hints_used: number;
  time_spent_seconds: number;
  topic_completion_ratio: number;
}

export interface MergePayload extends SessionMetrics {
  student_id: string;
  session_id: string;
  chapter_id: "grade8_rational_numbers";
  timestamp: string;
  session_status: "completed" | "exited";
  total_questions: number;
  total_hints_embedded: number;
}

export interface QuestionDefinition {
  id: string;
  subtopicId: string;
  prompt: string;
  difficulty: Difficulty;
  answer: string;
  skills: string[];
  error_tags: string[];
  hints: [string, string, string];
}

export interface ConceptDefinition {
  id: string;
  title: string;
  explanation: string;
  examples: string[];
  misconceptions: string[];
}

export interface SubtopicDefinition {
  id: string;
  title: string;
  concepts: ConceptDefinition[];
}

export interface PedagogyDecision {
  response_case: PedagogyResponseCase;
  zpd_difficulty: Difficulty;
  next_difficulty: Difficulty;
  hint_level: HintLevel;
  hint_text: string | null;
  trigger_remediation: boolean;
  remediation_stage: RemediationStage | null;
  skip_easy: boolean;
  inferred_mastery: number;
  mastery_unlocked: boolean;
  affective_trigger: boolean;
  action_label: "increase_difficulty" | "reinforcement" | "hint_progression";
}
