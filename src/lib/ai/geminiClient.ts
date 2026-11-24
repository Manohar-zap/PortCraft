import { GoogleGenAI } from '@google/genai';

/**
 * Returns all configured Gemini API keys from environment variables.
 * Supports primary GEMINI_API_KEY as well as rotation fallbacks GEMINI_API_KEY_1..4.
 */
export function getGeminiKeys(): string[] {
  const keys: (string | undefined)[] = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
  ];

  return keys
    .filter((k): k is string => typeof k === 'string' && k.trim().length > 0)
    .map(k => k.trim());
}

export function hasGeminiConfigured(): boolean {
  return getGeminiKeys().length > 0;
}

export function getGeminiModels(): string[] {
  const configured = process.env.GEMINI_MODEL?.trim();
  const models = [
    configured,
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-2.5-flash',
  ].filter((m): m is string => Boolean(m));

  return [...new Set(models)];
}

interface GenerateOptions {
  contents: Array<{ role: 'user' | 'model'; parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> }>;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
  preferredModel?: string;
  keyOverride?: string;
}

export interface GenerateResult {
  text: string;
  model: string;
  keyIndex: number;
}

/**
 * Executes content generation across Gemini API keys and models with automatic
 * fallback if a key is rate-limited (429), experiencing high demand (503), or deprecated (404).
 */
export async function generateGeminiContent(options: GenerateOptions): Promise<GenerateResult> {
  const allKeys = options.keyOverride ? [options.keyOverride, ...getGeminiKeys()] : getGeminiKeys();
  if (allKeys.length === 0) {
    throw new Error('AI features are not configured. Add GEMINI_API_KEY to environment variables.');
  }

  const models = options.preferredModel
    ? [options.preferredModel, ...getGeminiModels()]
    : getGeminiModels();

  let lastError: Error | null = null;

  for (let keyIdx = 0; keyIdx < allKeys.length; keyIdx++) {
    const key = allKeys[keyIdx];
    let aiClient: GoogleGenAI;
    try {
      aiClient = new GoogleGenAI({ apiKey: key });
    } catch (clientErr) {
      lastError = clientErr instanceof Error ? clientErr : new Error('Client initialization failed');
      continue;
    }

    for (const model of models) {
      try {
        const response = await aiClient.models.generateContent({
          model,
          contents: options.contents,
          config: {
            systemInstruction: options.systemInstruction,
            temperature: options.temperature ?? 0.7,
            maxOutputTokens: options.maxOutputTokens ?? 1500,
            responseMimeType: options.responseMimeType,
          },
        });

        const text = response.text || '';
        return {
          text,
          model,
          keyIndex: keyIdx,
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        lastError = err instanceof Error ? err : new Error(errorMsg);

        // If it's a 404 (model deprecated), try next model immediately with same key
        if (errorMsg.includes('404') || errorMsg.includes('not found') || errorMsg.includes('no longer available')) {
          continue;
        }

        // If 429 (rate limit) or 503 (high demand), break model loop to try the next API key
        if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('503') || errorMsg.includes('high demand')) {
          break;
        }

        // Other errors, continue to next fallback
      }
    }
  }

  throw lastError || new Error('All Gemini API keys and models failed');
}

/**
 * Searches web information via SerpAPI if configured.
 */
export async function searchWithSerpApi(query: string): Promise<string[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return [];

  try {
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}&num=5`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    const snippets: string[] = [];
    if (Array.isArray(data.organic_results)) {
      for (const r of data.organic_results) {
        if (r.snippet) snippets.push(r.snippet);
      }
    }
    return snippets;
  } catch {
    return [];
  }
}
