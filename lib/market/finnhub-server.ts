/**
 * Finnhub (server-only helpers).
 * Set FINNHUB_API_KEY in env — free tier includes market news.
 */
export const FINNHUB_REST = "https://finnhub.io/api/v1";

export function getFinnhubApiKey(): { key: string | null; configured: boolean } {
  const configured = process.env.FINNHUB_API_KEY?.trim() || null;
  return { key: configured, configured: Boolean(configured) };
}
