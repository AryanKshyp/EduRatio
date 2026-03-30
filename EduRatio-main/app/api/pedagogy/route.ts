import { generatePedagogyDecision, type PedagogyInput } from "@/lib/pedagogyService";
import { fail, isNonEmptyString, isNonNegativeNumber, ok, parseJson } from "@/lib/api";
import type { Difficulty } from "@/lib/types";

function isDifficulty(value: unknown): value is Difficulty {
  return value === "easy" || value === "medium" || value === "hard";
}

export async function POST(request: Request) {
  try {
    const body = await parseJson<Partial<PedagogyInput>>(request);
    if (
      !isNonNegativeNumber(body.mastery) ||
      !isDifficulty(body.current_difficulty) ||
      !isNonEmptyString(body.question_id) ||
      typeof body.is_correct !== "boolean" ||
      !isNonNegativeNumber(body.attempt_number) ||
      !isNonNegativeNumber(body.time_taken_seconds)
    ) {
      return fail("Invalid pedagogy payload", 400);
    }

    const decision = generatePedagogyDecision({
      mastery: body.mastery,
      current_difficulty: body.current_difficulty,
      question_id: body.question_id.trim(),
      is_correct: body.is_correct,
      attempt_number: body.attempt_number,
      time_taken_seconds: body.time_taken_seconds,
      failed_remedials: body.failed_remedials ?? 0,
      repeated_wrong_count: body.repeated_wrong_count ?? 0,
      average_time_seconds: body.average_time_seconds ?? body.time_taken_seconds,
      hint_count: body.hint_count ?? 0,
    });

    return ok(decision);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pedagogy request failed";
    return fail(message, 500);
  }
}
