import { createSession } from "@/db/repositories";
import { fail, isNonEmptyString, ok, parseJson } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const body = await parseJson<{ student_id?: string }>(request);
    if (!isNonEmptyString(body.student_id)) {
      return fail("student_id is required", 400);
    }

    const studentId = body.student_id.trim();
    const sessionId = `s_${Date.now()}_${studentId}`;
    const startedAt = new Date().toISOString();
    const created = await createSession({
      session_id: sessionId,
      student_id: studentId,
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
