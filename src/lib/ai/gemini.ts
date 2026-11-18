/**
 * Minimal Google Gemini client (REST, no SDK dependency). Server-side only —
 * the API key is read from the environment and must never reach the browser.
 *
 * Get a free key from Google AI Studio and set GEMINI_API_KEY. GEMINI_MODEL is
 * optional so the model can be bumped without a code change.
 */

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
// An alias Google keeps pointed at the current Flash model, so the app doesn't
// break when a pinned version is retired (gemini-2.5-flash already was).
const DEFAULT_MODEL = "gemini-flash-latest";
const FALLBACK_MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-lite-latest"];
/** Per-model attempt timeout. */
const TIMEOUT_MS = 25_000;
/** Whole call, all fallbacks included — keep below the page's maxDuration (60s). */
const TOTAL_BUDGET_MS = 50_000;

export class AiError extends Error {
  code: "NOT_CONFIGURED" | "RATE_LIMITED" | "UPSTREAM" | "BAD_RESPONSE";
  /** Worth trying again (overload, timeout, per-minute limit). */
  retryable: boolean;
  /** Short, secret-free reason safe to show the coach (e.g. "HTTP 400", "timeout"). */
  detail: string;
  constructor(message: string, code: AiError["code"], retryable = false, detail: string = code) {
    super(message);
    this.name = "AiError";
    this.code = code;
    this.retryable = retryable;
    this.detail = detail;
  }
}

/**
 * The key as pasted into the hosting dashboard often carries quotes or a
 * trailing newline/space, which Google rejects as an invalid key.
 */
function readKey(): string {
  return (process.env.GEMINI_API_KEY ?? "").trim().replace(/^["']+|["']+$/g, "").trim();
}

export function isAiConfigured(): boolean {
  return readKey().length > 0;
}

/**
 * Ask Gemini for a JSON answer that matches `responseSchema` (Gemini's OpenAPI
 * subset) and return it parsed. The caller still validates the shape — the
 * model can ignore a schema, and nothing it returns is trusted as-is.
 */
export async function geminiJson(opts: {
  system: string;
  prompt: string;
  responseSchema: Record<string, unknown>;
  temperature?: number;
}): Promise<unknown> {
  const key = readKey();
  if (!key) throw new AiError("GEMINI_API_KEY is not set", "NOT_CONFIGURED");
  const primary = (process.env.GEMINI_MODEL ?? "").trim() || DEFAULT_MODEL;
  // Free-tier models often answer 503 "high demand". Retrying the same model
  // rarely helps, so move to a different one; a retired fallback (404) is
  // skipped the same way.
  const attempts = [primary, ...FALLBACK_MODELS].filter((m, i, arr) => arr.indexOf(m) === i);

  // One overall budget across every attempt, so the whole call ends well
  // inside the serverless function limit (Vercel: maxDuration on the page).
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  let lastErr: AiError | null = null;
  for (let i = 0; i < attempts.length; i++) {
    const remaining = deadline - Date.now();
    if (remaining < 4_000) break;
    try {
      return await callModel(key, attempts[i], opts, Math.min(TIMEOUT_MS, remaining));
    } catch (e) {
      if (!(e instanceof AiError) || !e.retryable) throw e;
      console.warn("[gemini] attempt failed:", attempts[i], e.detail);
      lastErr = e;
      if (i < attempts.length - 1) await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw lastErr ?? new AiError("Gemini unavailable", "UPSTREAM", false, "timeout");
}

async function callModel(
  key: string,
  model: string,
  opts: Parameters<typeof geminiJson>[0],
  timeoutMs: number,
): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: opts.system }] },
        contents: [{ role: "user", parts: [{ text: opts.prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: opts.responseSchema,
          temperature: opts.temperature ?? 0.7,
        },
      }),
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch (e) {
    const err = e as Error;
    const timedOut = err.name === "TimeoutError" || err.name === "AbortError";
    throw new AiError(
      `Gemini ${model} request failed: ${err.message}`,
      "UPSTREAM",
      true,
      timedOut ? "timeout" : "network",
    );
  }

  if (res.status === 429)
    throw new AiError(`Gemini ${model} rate limit`, "RATE_LIMITED", true, "HTTP 429");
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new AiError(
      `Gemini ${model} HTTP ${res.status}: ${body.slice(0, 300)}`,
      "UPSTREAM",
      res.status >= 500 || res.status === 404,
      `HTTP ${res.status}`,
    );
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  try {
    return JSON.parse(text);
  } catch {
    // Another model may answer cleanly — move on rather than give up.
    throw new AiError(`Gemini ${model} returned non-JSON output`, "BAD_RESPONSE", true, "bad JSON");
  }
}
