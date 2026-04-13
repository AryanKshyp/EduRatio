import { createSession, getSessionBySessionId, updateSessionMetrics } from "@/db/repositories";
import { fail, getBearerToken, isNonEmptyString, isNonNegativeNumber, ok, parseJson } from "@/lib/api";

export async function POST(request: Request) {
  try {
    if (!getBearerToken(request)) {
      return fail("Authorization bearer token is required", 401);
    }

    const body = await parseJson<{
      student_id?: string;
      session_id?: string;
      total_questions?: number;
      total_hints_embedded?: number;
    }>(request);
    if (
      !isNonEmptyString(body.student_id) ||
      !isNonEmptyString(body.session_id) ||
      !isNonNegativeNumber(body.total_questions) ||
      !isNonNegativeNumber(body.total_hints_embedded)
    ) {
      return fail("student_id, session_id, total_questions, total_hints_embedded are required", 400);
    }

    const studentId = body.student_id.trim();
    const sessionId = body.session_id.trim();
    const startedAt = new Date().toISOString();
    const existing = await getSessionBySessionId(sessionId);
    if (existing.data) {
      const refreshed = await updateSessionMetrics(sessionId, {
        total_questions: body.total_questions,
        total_hints_embedded: body.total_hints_embedded,
      });
      if (refreshed.error) {
        return fail(refreshed.error.message, 500);
      }

      return ok({
        session_id: sessionId,
        start_time: existing.data.started_at,
        resumed: true,
      });
    }

    const created = await createSession({
      session_id: sessionId,
      student_id: studentId,
      total_questions: body.total_questions,
      total_hints_embedded: body.total_hints_embedded,
    });

    if (created.error) {
      return fail(created.error.message, 500);
    }

    return ok({
      session_id: sessionId,
      start_time: startedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create session";
    return fail(message, 500);
  }
}
