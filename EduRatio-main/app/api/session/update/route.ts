import { getSessionBySessionId, insertQuestionAttempt, updateSessionMetrics } from "@/db/repositories";
import { getQuestionsForSubtopic } from "@/lib/content";
import { updateLearnerStateAndMastery } from "@/lib/learnerService";
import { generatePedagogyDecision } from "@/lib/pedagogyService";
import type { Difficulty } from "@/lib/types";
import { fail, getBearerToken, isNonEmptyString, isNonNegativeNumber, ok, parseJson } from "@/lib/api";
import { errorMessageFromUnknown, logRouteError, newRequestId } from "@/lib/routeErrorLog";

interface SessionUpdateRequest {
  session_id: string;
  event: "question_attempt";
  data: {
    subtopic_id: string;
    question_id: string;
    correct: boolean;
    attempt: number;
    hint_level: 0 | 1 | 2 | 3;
    time_taken: number;
    current_difficulty: Difficulty;
    remedial_done: 0 | 1 | 2;
    answer_text?: string;
    error_tags?: string[];
    failed_remedials?: number;
    repeated_wrong_count?: number;
    average_time_seconds?: number;
    hint_count?: number;
    is_first_attempt?: boolean;
  };
}

function isHintLevel(value: unknown): value is 0 | 1 | 2 | 3 {
  return value === 0 || value === 1 || value === 2 || value === 3;
}

function isRemedialDone(value: unknown): value is 0 | 1 | 2 {
  return value === 0 || value === 1 || value === 2;
}

function isDifficulty(value: unknown): value is Difficulty {
  return value === "easy" || value === "medium" || value === "hard";
}

function safeSessionInt(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  return fallback;
}

export async function POST(request: Request) {
  const requestId = newRequestId();
  const errHeaders = { "X-Request-Id": requestId };

  try {
    if (!getBearerToken(request)) {
      return fail("Authorization bearer token is required", 401);
    }

    const body = await parseJson<SessionUpdateRequest>(request);
    if (
      !isNonEmptyString(body.session_id) ||
      body.event !== "question_attempt" ||
      !body.data ||
      !isNonEmptyString(body.data.subtopic_id) ||
      !isNonEmptyString(body.data.question_id) ||
      !isNonNegativeNumber(body.data.attempt) ||
      !isNonNegativeNumber(body.data.time_taken) ||
      !isHintLevel(body.data.hint_level) ||
      !isRemedialDone(body.data.remedial_done) ||
      typeof body.data.correct !== "boolean" ||
      !isDifficulty(body.data.current_difficulty)
    ) {
      return fail("Invalid update payload", 400);
    }

    const sessionId = body.session_id.trim();
    const session = await getSessionBySessionId(sessionId);
    if (session.error || !session.data) {
      return fail("Session not found", 404);
    }

    const learnerUpdate = await updateLearnerStateAndMastery({
      session_id: sessionId,
      subtopic_id: body.data.subtopic_id.trim(),
      question_id: body.data.question_id.trim(),
      attempt: body.data.attempt,
      hint_level: body.data.hint_level,
      time_taken_seconds: body.data.time_taken,
      remedial_done: body.data.remedial_done,
      error_tags: body.data.error_tags ?? [],
    });

    const attemptInsert = await insertQuestionAttempt({
      session_id: sessionId,
      subtopic_id: body.data.subtopic_id.trim(),
      concept_id: null,
      question_id: body.data.question_id.trim(),
      difficulty: body.data.current_difficulty,
      is_correct: body.data.correct,
      attempt_number: body.data.attempt,
      hint_level: body.data.hint_level,
      time_taken_seconds: body.data.time_taken,
      error_tags: body.data.error_tags ?? [],
      answer_text: body.data.answer_text ?? null,
    });
    if (attemptInsert.error) {
      logRouteError("session/update", requestId, attemptInsert.error, {
        step: "insertQuestionAttempt",
        session_id: sessionId,
      });
      return fail(attemptInsert.error.message, 500, { requestId }, errHeaders);
    }

    const current = session.data;
    const questionsAttempted =
      safeSessionInt(current.questions_attempted) + (body.data.is_first_attempt ? 1 : 0);
    const totalQuestions = safeSessionInt(current.total_questions);
    const topicCompletionRatio =
      totalQuestions > 0 ? Math.min(1, questionsAttempted / totalQuestions) : 0;

    const patch = {
      correct_answers: safeSessionInt(current.correct_answers) + (body.data.correct ? 1 : 0),
      wrong_answers: safeSessionInt(current.wrong_answers) + (body.data.correct ? 0 : 1),
      questions_attempted: questionsAttempted,
      retry_count: safeSessionInt(current.retry_count) + (body.data.attempt > 1 ? 1 : 0),
      hints_used: safeSessionInt(current.hints_used) + (body.data.hint_level > 0 ? 1 : 0),
      total_hints_embedded: safeSessionInt(current.total_hints_embedded),
      time_spent_seconds: safeSessionInt(current.time_spent_seconds) + body.data.time_taken,
      topic_completion_ratio: topicCompletionRatio,
    };
    const metricsUpdate = await updateSessionMetrics(sessionId, patch);
    if (metricsUpdate.error) {
      logRouteError("session/update", requestId, metricsUpdate.error, {
        step: "updateSessionMetrics",
        session_id: sessionId,
        patch,
      });
      return fail(metricsUpdate.error.message, 500, { requestId }, errHeaders);
    }

    const pedagogyDecision = generatePedagogyDecision({
      mastery: learnerUpdate.components.mastery,
      current_difficulty: body.data.current_difficulty,
      question_id: body.data.question_id.trim(),
      is_correct: body.data.correct,
      attempt_number: body.data.attempt,
      time_taken_seconds: body.data.time_taken,
      failed_remedials: body.data.failed_remedials ?? 0,
      repeated_wrong_count: body.data.repeated_wrong_count ?? 0,
      average_time_seconds: body.data.average_time_seconds ?? body.data.time_taken,
      hint_count: body.data.hint_count ?? body.data.hint_level,
    });

    const candidate = getQuestionsForSubtopic(body.data.subtopic_id.trim()).find(
      (question) => question.difficulty === pedagogyDecision.next_difficulty,
    );

    return ok({
      session_id: sessionId,
      event: body.event,
      learner: learnerUpdate,
      metrics: patch,
      pedagogy: pedagogyDecision,
      next_question_id: candidate?.id ?? null,
    });
  } catch (error) {
    logRouteError("session/update", requestId, error, { step: "unhandled" });
    const message = errorMessageFromUnknown(error, "Session update failed");
    return fail(message, 500, { requestId }, errHeaders);
  }
}
