import { getSessionBySessionId, insertQuestionAttempt, updateSessionMetrics } from "@/db/repositories";
import { getQuestionsForSubtopic } from "@/lib/content";
import { updateLearnerStateAndMastery } from "@/lib/learnerService";
import { generatePedagogyDecision } from "@/lib/pedagogyService";
import type { Difficulty } from "@/lib/types";
import { fail, getBearerToken, isNonEmptyString, isNonNegativeNumber, ok, parseJson } from "@/lib/api";

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

export async function POST(request: Request) {
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
      !isNonNegativeNumber(body.data.time_taken)
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
      return fail(attemptInsert.error.message, 500);
    }

    const current = session.data;
    const questionsAttempted = current.questions_attempted + (body.data.is_first_attempt ? 1 : 0);
    const totalQuestions = current.total_questions;
    const topicCompletionRatio = Math.min(1, questionsAttempted / totalQuestions);

    const patch = {
      correct_answers: current.correct_answers + (body.data.correct ? 1 : 0),
      wrong_answers: current.wrong_answers + (body.data.correct ? 0 : 1),
      questions_attempted: questionsAttempted,
      retry_count: current.retry_count + (body.data.attempt > 1 ? 1 : 0),
      hints_used: current.hints_used + (body.data.hint_level > 0 ? 1 : 0),
      total_hints_embedded: current.total_hints_embedded,
      time_spent_seconds: current.time_spent_seconds + body.data.time_taken,
      topic_completion_ratio: topicCompletionRatio,
    };
    const metricsUpdate = await updateSessionMetrics(sessionId, patch);
    if (metricsUpdate.error) {
      return fail(metricsUpdate.error.message, 500);
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
    const message = error instanceof Error ? error.message : "Session update failed";
    return fail(message, 500);
  }
}
