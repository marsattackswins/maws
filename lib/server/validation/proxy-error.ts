import "server-only";

/**
 * Generic rate limit response - never exposes provider details.
 * Used when upstream returns HTTP 429.
 */
export function rateLimitResponse(): Response {
  return Response.json(
    { error: "Rate limit exceeded" },
    { status: 429, headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * Generic upstream error response - never exposes provider details.
 * Used for upstream 4xx (except 429), 5xx, network errors, and malformed responses.
 */
export function upstreamErrorResponse(): Response {
  return Response.json(
    { error: "Upstream service unavailable" },
    { status: 502, headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * Map upstream HTTP status to safe client response.
 * - 429 → generic 429 body
 * - All other non-2xx → generic 502 body
 */
export function mapUpstreamError(status: number): Response {
  if (status === 429) return rateLimitResponse();
  return upstreamErrorResponse();
}
