/**
 * Server-only helpers for Lovable AI.
 *
 * Truthfulness rules are repeated in every prompt: the model may never invent
 * facts, dialogue, dates, names or feelings, and must preserve uncertainty and
 * the person's own voice. The original text and raw transcript are always kept
 * alongside anything the model produces.
 */

const GATEWAY = "https://ai.gateway.lovable.dev/v1";

export class AiGatewayError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "AiGatewayError";
  }
}

function apiKey(): string {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet.");
  return key;
}

function friendly(status: number, body: string): AiGatewayError {
  let message = body;
  try {
    const parsed = JSON.parse(body) as { error?: { message?: string }; message?: string };
    message = parsed.error?.message ?? parsed.message ?? body;
  } catch {
    /* keep raw body */
  }
  if (status === 429) message = "The AI is busy right now — try again in a moment.";
  if (status === 402) message = message || "AI credits are exhausted for this workspace.";
  return new AiGatewayError(status, message || `AI request failed (${status})`);
}

export async function transcribeAudio(
  audio: Uint8Array,
  mimeType: string,
): Promise<string> {
  const form = new FormData();
  const ext = mimeType.includes("mp4") ? "mp4" : mimeType.includes("mpeg") ? "mp3" : "webm";
  form.append("file", new Blob([audio as BlobPart], { type: mimeType }), `memory.${ext}`);
  form.append("model", "openai/gpt-4o-transcribe");

  const res = await fetch(`${GATEWAY}/audio/transcriptions`, {
    method: "POST",
    headers: { "Lovable-API-Key": apiKey() },
    body: form,
  });
  if (!res.ok) throw friendly(res.status, await res.text());
  const json = (await res.json()) as { text?: string };
  return (json.text ?? "").trim();
}

const TRUTH_RULES = `Absolute rules:
- Never invent facts, dialogue, names, places, dates, ages or feelings.
- Never add detail that is not present in the source text.
- Preserve uncertainty exactly ("I think", "maybe", "around 1972").
- Keep the person's own voice, vocabulary and idioms. Do not make it literary.
- You may fix punctuation, remove filler words and repetition, and break the text into paragraphs.
- If the source is very short, leave it almost unchanged.`;

export type MemoryEnrichment = {
  polished: string;
  title: string;
  people: string[];
  places: string[];
  approximateYear: number | null;
  followUp: string | null;
};

export async function enrichMemory(input: {
  question: string | null;
  text: string;
}): Promise<MemoryEnrichment> {
  const system = `You help preserve someone's real memories for their family archive. ${TRUTH_RULES}

Return strict JSON with keys:
"polished": a lightly cleaned version of the memory (same content, same voice),
"title": a short plain title of at most 8 words drawn only from what was said,
"people": names of people explicitly mentioned,
"places": places explicitly mentioned,
"approximate_year": a four digit year ONLY if the text states or clearly implies one, otherwise null,
"follow_up": one specific, concrete question that would draw out more of THIS memory, or null if nothing obvious is missing.`;

  const res = await fetch(`${GATEWAY}/chat/completions`, {
    method: "POST",
    headers: {
      "Lovable-API-Key": apiKey(),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Question asked: ${input.question ?? "(none)"}\n\nTheir answer:\n${input.text}`,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw friendly(res.status, await res.text());

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = json.choices?.[0]?.message?.content ?? "{}";
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(raw.replace(/^```(?:json)?|```$/g, "").trim()) as Record<string, unknown>;
  } catch {
    parsed = {};
  }

  const asStrings = (value: unknown): string[] =>
    Array.isArray(value)
      ? value.filter((v): v is string => typeof v === "string" && v.trim().length > 0).slice(0, 20)
      : [];

  const yearRaw = parsed["approximate_year"];
  const year =
    typeof yearRaw === "number" && yearRaw > 1900 && yearRaw < 2100 ? Math.round(yearRaw) : null;

  return {
    polished: typeof parsed["polished"] === "string" ? (parsed["polished"] as string) : input.text,
    title: typeof parsed["title"] === "string" ? (parsed["title"] as string).slice(0, 120) : "",
    people: asStrings(parsed["people"]),
    places: asStrings(parsed["places"]),
    approximateYear: year,
    followUp:
      typeof parsed["follow_up"] === "string" && parsed["follow_up"].trim().length > 0
        ? (parsed["follow_up"] as string).slice(0, 300)
        : null,
  };
}
