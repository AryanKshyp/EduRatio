import { getSessionBySessionId, insertPenUsage } from "@/db/repositories";
import { generatePenResponse, type PenRequest } from "@/lib/penEngine";
import { fail, isNonEmptyString, ok, parseJson } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const body = await parseJson<PenRequest>(request);
    if (!body.intent || !isNonEmptyString(body.structuredContent) || !isNonEmptyString(body.context?.subtopicId)) {
      return fail("Invalid Pen request", 400);
    }

    const response = await generatePenResponse(body);

    if (body.context.sessionId) {
      const session = await getSessionBySessionId(body.context.sessionId);
      if (session.data) {
        const saved = await insertPenUsage({
          session_id: body.context.sessionId,
          subtopic_id: body.context.subtopicId,
          question_id: body.context.questionId ?? null,
          interaction_type: body.interactionType ?? body.intent,
          hint_level: body.context.hintLevel ?? null,
          prompt_content: body.structuredContent,
          response_content: response.text,
          response_source: response.source,
        });
        if (saved.error) {
          return fail(saved.error.message, 500);
        }
      }
    }

    return ok(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pen request failed";
    return fail(message, 500);
  }
}
