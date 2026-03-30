export type PenIntent = "explanation" | "hint" | "remediation" | "motivation";
export type PenInteractionType = "open" | "explanation" | "hint" | "remediation" | "motivation";

export interface PenRequest {
  intent: PenIntent;
  interactionType?: PenInteractionType;
  structuredContent: string;
  context: {
    sessionId?: string;
    subtopicId: string;
    conceptId?: string;
    questionId?: string;
    hintLevel?: 1 | 2 | 3;
  };
}

export interface PenResponse {
  text: string;
  source: "gemini" | "fallback";
}

async function callGeminiApi(payload: PenRequest): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  // Structure is production-ready; endpoint wire-up can be switched to SDK later.
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Rephrase for Grade 8 learner. Do not invent new math content. Intent: ${payload.intent}. Content: ${payload.structuredContent}`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini error: ${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    throw new Error("Gemini returned empty text");
  }
  return text;
}

export async function generatePenResponse(payload: PenRequest): Promise<PenResponse> {
  try {
    const text = await callGeminiApi(payload);
    return { text, source: "gemini" };
  } catch {
    return {
      text: `Pen says: ${payload.structuredContent}`,
      source: "fallback",
    };
  }
}
