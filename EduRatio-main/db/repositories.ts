import { supabase } from "@/db/supabaseClient";
import type {
  ErrorPatternsRow,
  LearnerModelStateRow,
  MasteryScoresRow,
  PenUsageRow,
  QuestionAttemptsRow,
  SessionsRow,
} from "@/db/schema.types";

export async function createSession(row: Pick<SessionsRow, "session_id" | "student_id">) {
  const payload = {
    ...row,
    chapter_id: "grade8_rational_numbers" as const,
  };
  return supabase.from("sessions").insert(payload);
}

export async function updateSessionMetrics(
  sessionId: string,
  patch: Partial<
    Pick<
      SessionsRow,
      | "session_status"
      | "correct_answers"
      | "wrong_answers"
      | "questions_attempted"
      | "retry_count"
      | "hints_used"
      | "total_hints_embedded"
      | "time_spent_seconds"
      | "topic_completion_ratio"
      | "merge_dispatched"
      | "merge_dispatch_attempts"
      | "completed_at"
    >
  >,
) {
  return supabase.from("sessions").update(patch).eq("session_id", sessionId);
}

export async function insertQuestionAttempt(row: QuestionAttemptsRow) {
  return supabase.from("question_attempts").insert(row);
}

export async function insertMasteryScore(row: MasteryScoresRow) {
  return supabase.from("mastery_scores").insert(row);
}

export async function upsertErrorPattern(row: ErrorPatternsRow) {
  return supabase
    .from("error_patterns")
    .upsert(row, { onConflict: "session_id,question_id,error_tag" });
}

export async function incrementErrorPattern(row: Omit<ErrorPatternsRow, "occurrences">) {
  const existing = await supabase
    .from("error_patterns")
    .select("occurrences")
    .eq("session_id", row.session_id)
    .eq("question_id", row.question_id)
    .eq("error_tag", row.error_tag)
    .maybeSingle();

  if (existing.error) return { error: existing.error };

  if (existing.data) {
    return supabase
      .from("error_patterns")
      .update({ occurrences: existing.data.occurrences + 1 })
      .eq("session_id", row.session_id)
      .eq("question_id", row.question_id)
      .eq("error_tag", row.error_tag);
  }

  return supabase.from("error_patterns").insert({
    ...row,
    occurrences: 1,
  });
}

export async function insertPenUsage(row: PenUsageRow) {
  return supabase.from("pen_usage").insert(row);
}

export async function getSessionBySessionId(sessionId: string) {
  return supabase.from("sessions").select("*").eq("session_id", sessionId).single();
}

export async function getLearnerModelState(sessionId: string, subtopicId: string) {
  return supabase
    .from("learner_model_states")
    .select("*")
    .eq("session_id", sessionId)
    .eq("subtopic_id", subtopicId)
    .maybeSingle();
}

export async function upsertLearnerModelState(row: LearnerModelStateRow) {
  return supabase
    .from("learner_model_states")
    .upsert(row, { onConflict: "session_id,subtopic_id" });
}
