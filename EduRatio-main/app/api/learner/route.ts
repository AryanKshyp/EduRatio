import { updateLearnerStateAndMastery } from "@/lib/learnerService";
import { fail, isNonEmptyString, isNonNegativeNumber, ok, parseJson } from "@/lib/api";

interface LearnerUpdateRequest {
  session_id: string;
  subtopic_id: string;
  question_id: string;
  attempt: number;
  hint_level: 0 | 1 | 2 | 3;
  time_taken_seconds: number;
  remedial_done: 0 | 1 | 2;
  error_tags: string[];
}

export async function POST(request: Request) {
  try {
    const body = await parseJson<LearnerUpdateRequest>(request);
    if (!isNonEmptyString(body.session_id) || !isNonEmptyString(body.subtopic_id) || !isNonEmptyString(body.question_id)) {
      return fail("session_id, subtopic_id, question_id are required", 400);
    }
    if (!isNonNegativeNumber(body.attempt) || !isNonNegativeNumber(body.time_taken_seconds)) {
      return fail("attempt and time_taken_seconds must be non-negative numbers", 400);
    }

    const result = await updateLearnerStateAndMastery({
      session_id: body.session_id.trim(),
      subtopic_id: body.subtopic_id.trim(),
      question_id: body.question_id.trim(),
      attempt: body.attempt,
      hint_level: body.hint_level,
      time_taken_seconds: body.time_taken_seconds,
      remedial_done: body.remedial_done,
      error_tags: body.error_tags ?? [],
    });

    return ok(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Learner update failed";
    return fail(message, 500);
  }
}
