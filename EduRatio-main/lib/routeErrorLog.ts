/**
 * Structured logs for API routes — stdout/stderr are captured by PM2 (`pm2 logs`).
 */

export function newRequestId(): string {
  return crypto.randomUUID();
}

export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return { name: error.name, message: error.message, stack: error.stack };
  }
  if (error && typeof error === "object") {
    const o = error as Record<string, unknown>;
    return {
      kind: "object",
      message: String(o.message ?? o.error_description ?? ""),
      code: o.code,
      details: o.details,
      hint: o.hint,
    };
  }
  return { kind: "unknown", value: String(error) };
}

export function logRouteError(
  scope: string,
  requestId: string,
  error: unknown,
  extra?: Record<string, unknown>,
): void {
  const line = JSON.stringify({
    scope,
    requestId,
    time: new Date().toISOString(),
    ...extra,
    error: serializeError(error),
  });
  console.error("[api]", line);
}

/** Readable message when `throw` may be a PostgrestError or other non-Error object. */
export function errorMessageFromUnknown(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const m = (error as { message: unknown }).message;
    if (typeof m === "string" && m.trim().length > 0) return m;
  }
  return fallback;
}
