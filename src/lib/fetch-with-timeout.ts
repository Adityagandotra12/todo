/**
 * Avoid waiting for long server-side DB pool timeouts (~10s) when the API is unreachable.
 * Fast DB responses still return immediately.
 */
export const QUERY_TIMEOUT_MS = 2200;
export const MUTATION_TIMEOUT_MS = 1200;

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = QUERY_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export function isAbortError(e: unknown): boolean {
  if (e instanceof DOMException && e.name === "AbortError") return true;
  if (e instanceof Error && e.name === "AbortError") return true;
  return false;
}
