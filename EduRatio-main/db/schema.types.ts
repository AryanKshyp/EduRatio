export interface SessionsRow {
  session_id: string;
  student_id: string;
  chapter_id: "grade8_rational_numbers";
  session_status: "active" | "completed" | "exited";
  correct_answers: number;
  wrong_answers: number;
  questions_attempted: number;
  total_questions: number;
  retry_count: number;
  hints_used: number;
  total_hints_embedded: number;
  time_spent_seconds: number;
  topic_completion_ratio: number;
  merge_dispatched: boolean;
  merge_dispatch_attempts: number;
  started_at: string;
  completed_at: string | null;
}

export interface QuestionAttemptsRow {
  session_id: string;
  subtopic_id: string;
  concept_id: string | null;
  question_id: string;
  difficulty: "easy" | "medium" | "hard";
  is_correct: boolean;
  attempt_number: number;
  hint_level: 0 | 1 | 2 | 3;
  time_taken_seconds: number;
  error_tags: string[];
  answer_text: string | null;
}

export interface MasteryScoresRow {
  session_id: string;
  subtopic_id: string;
  attempt_efficiency: number;
  independence_score: number;
  error_component: number;
  time_engagement: number;
  remedial_multiplier: number;
  raw_score: number;
  mastery_score: number;
  mastery_level: "L1" | "L2" | "L3" | "L4" | "L5";
}

export interface ErrorPatternsRow {
  session_id: string;
  subtopic_id: string;
  question_id: string;
  error_tag: string;
  occurrences: number;
}

export interface PenUsageRow {
  session_id: string;
  subtopic_id: string;
  question_id: string | null;
  interaction_type: "open" | "explanation" | "hint" | "remediation" | "motivation";
  hint_level: 1 | 2 | 3 | null;
  prompt_content: string;
  response_content: string;
  response_source: "gemini" | "fallback";
}

export interface LearnerModelStateRow {
  session_id: string;
  subtopic_id: string;
  attempts: number[];
  hint_usage: Array<0 | 1 | 2 | 3>;
  error_patterns: string[];
  time_on_task: number[];
  remedial_done: 0 | 1 | 2;
  latest_attempt_efficiency: number;
  latest_independence_score: number;
  latest_error_component: number;
  latest_time_engagement: number;
  latest_remedial_multiplier: number;
  latest_raw_score: number;
  latest_mastery_score: number;
}
