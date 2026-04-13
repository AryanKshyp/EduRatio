import { getSessionBySessionId, updateSessionMetrics } from "@/db/repositories";
import { fail, getBearerToken, isNonEmptyString, ok, parseJson } from "@/lib/api";
import { buildMergePayload, dispatchMergePayload } from "@/lib/mergeService";

export async function POST(request: Request) {
  try {
    const body = await parseJson<{
      session_id?: string;
      status?: "completed" | "exited_midway";
      token?: string;
    }>(request);
    const token = getBearerToken(request) ?? (isNonEmptyString(body.token) ? body.token.trim() : null);
    if (!token) {
      return fail("Authorization bearer token is required", 401);
    }
    if (!isNonEmptyString(body.session_id) || !body.status) {
      return fail("session_id and status are required", 400);
    }

    const sessionId = body.session_id.trim();
    const status = body.status;

    const existing = await getSessionBySessionId(sessionId);
    if (existing.error || !existing.data) {
      return fail("Session not found", 404);
    }

    const internalStatus = status === "completed" ? "completed" : "exited";

    const update = await updateSessionMetrics(sessionId, {
      session_status: internalStatus,
      completed_at: new Date().toISOString(),
    });
    if (update.error) {
      return fail(update.error.message, 500);
    }

    const session = existing.data;
    if (session.merge_dispatched) {
      return ok({
        session_id: sessionId,
        status,
        merge: {
          dispatched: true,
          skipped: true,
          reason: "already_dispatched",
          dispatch_attempts: session.merge_dispatch_attempts,
        },
      });
    }

    const mergePayload = buildMergePayload(session, status);
    const mergeResult = await dispatchMergePayload(mergePayload, token);
    const nextAttempts = session.merge_dispatch_attempts + 1;

    const mergeUpdate = await updateSessionMetrics(sessionId, {
      merge_dispatch_attempts: nextAttempts,
      merge_dispatched: mergeResult.ok,
    });
    if (mergeUpdate.error) {
      return fail(mergeUpdate.error.message, 500);
    }

    if (!mergeResult.ok) {
      return fail("Merge dispatch failed", 502, {
        session_id: sessionId,
        dispatch_attempts: nextAttempts,
        merge_error: mergeResult.error,
      });
    }

    return ok({
      session_id: sessionId,
      status,
      merge: {
        dispatched: true,
        dispatch_attempts: nextAttempts,
      },
      recommendation: mergeResult.data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to complete session";
    return fail(message, 500);
  }
}
