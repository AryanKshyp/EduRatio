import type { SessionsRow } from "@/db/schema.types";
import type { MergePayload, MergeSessionStatus } from "@/lib/types";

/** Official recommendation endpoint (override with MERGE_API_URL in env). */
export const DEFAULT_MERGE_API_URL = "https://kaushik-dev.online/api/recommend/";

function toNullableNumber(value: unknown): number | null {
  const converted = Number(value);
  return Number.isFinite(converted) ? converted : null;
}

export function buildMergePayload(
  session: SessionsRow,
  status: MergeSessionStatus,
): MergePayload {
  return {
    student_id: session.student_id,
    session_id: session.session_id,
    chapter_id: "grade8_rational_numbers",
    timestamp: new Date().toISOString(),
    session_status: status,
    correct_answers: toNullableNumber(session.correct_answers),
    wrong_answers: toNullableNumber(session.wrong_answers),
    questions_attempted: toNullableNumber(session.questions_attempted),
    total_questions: toNullableNumber(session.total_questions),
    retry_count: toNullableNumber(session.retry_count),
    hints_used: toNullableNumber(session.hints_used),
    total_hints_embedded: toNullableNumber(session.total_hints_embedded),
    time_spent_seconds: toNullableNumber(session.time_spent_seconds),
    topic_completion_ratio: toNullableNumber(session.topic_completion_ratio),
  };
}

function validateMergePayload(payload: MergePayload): string | null {
  if (
    payload.correct_answers !== null &&
    payload.wrong_answers !== null &&
    payload.questions_attempted !== null &&
    payload.correct_answers + payload.wrong_answers > payload.questions_attempted
  ) {
    return "correct_answers + wrong_answers must be <= questions_attempted";
  }
  if (
    payload.questions_attempted !== null &&
    payload.total_questions !== null &&
    payload.questions_attempted > payload.total_questions
  ) {
    return "questions_attempted must be <= total_questions";
  }
  if (
    payload.retry_count !== null &&
    payload.questions_attempted !== null &&
    payload.retry_count > payload.questions_attempted
  ) {
    return "retry_count must be <= questions_attempted";
  }
  if (
    payload.hints_used !== null &&
    payload.total_hints_embedded !== null &&
    payload.hints_used > payload.total_hints_embedded
  ) {
    return "hints_used must be <= total_hints_embedded";
  }
  if (
    payload.topic_completion_ratio !== null &&
    (payload.topic_completion_ratio < 0 || payload.topic_completion_ratio > 1)
  ) {
    return "topic_completion_ratio must be between 0 and 1";
  }
  if (
    payload.session_status === "completed" &&
    payload.questions_attempted !== null &&
    payload.total_questions !== null &&
    payload.questions_attempted !== payload.total_questions
  ) {
    return "completed sessions must have questions_attempted equal total_questions";
  }
  return null;
}

export async function dispatchMergePayload(
  payload: MergePayload,
  token: string,
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const endpoint = process.env.MERGE_API_URL?.trim() || DEFAULT_MERGE_API_URL;

  const validationError = validateMergePayload(payload);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const maxAttempts = 3;
  let lastError = "Merge API request failed";

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = (await response.json()) as unknown;
        return { ok: true, data };
      }

      lastError = `Merge API failed with status ${response.status}`;
      if (response.status >= 400 && response.status < 500 && response.status !== 408 && response.status !== 429) {
        return { ok: false, error: lastError };
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Merge API request failed";
    }

    if (attempt < maxAttempts - 1) {
      await new Promise((r) => setTimeout(r, 300 * 2 ** attempt));
    }
  }

  return { ok: false, error: lastError };
}
