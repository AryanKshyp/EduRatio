import type { SessionsRow } from "@/db/schema.types";
import type { MergePayload } from "@/lib/types";

function toNumber(value: unknown, fallback = 0): number {
  const converted = Number(value);
  return Number.isFinite(converted) ? converted : fallback;
}

export function buildMergePayload(
  session: SessionsRow,
  status: "completed" | "exited",
): MergePayload {
  return {
    student_id: session.student_id,
    session_id: session.session_id,
    chapter_id: "grade8_rational_numbers",
    timestamp: new Date().toISOString(),
    session_status: status,
    correct_answers: toNumber(session.correct_answers),
    wrong_answers: toNumber(session.wrong_answers),
    questions_attempted: toNumber(session.questions_attempted),
    total_questions: toNumber(session.total_questions, 20),
    retry_count: toNumber(session.retry_count),
    hints_used: toNumber(session.hints_used),
    total_hints_embedded: toNumber(session.total_hints_embedded),
    time_spent_seconds: toNumber(session.time_spent_seconds),
    topic_completion_ratio: toNumber(session.topic_completion_ratio),
  };
}

export async function dispatchMergePayload(payload: MergePayload): Promise<{ ok: true } | { ok: false; error: string }> {
  const endpoint = process.env.MERGE_API_URL;
  if (!endpoint) {
    return { ok: false, error: "MERGE_API_URL is not configured" };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { ok: false, error: `Merge API failed with status ${response.status}` };
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Merge API request failed";
    return { ok: false, error: message };
  }
}
