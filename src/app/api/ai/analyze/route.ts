import type { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

function getClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

export async function POST(request: NextRequest) {
  const client = getClient();
  if (!client) {
    return Response.json({ error: 'AI features not configured' }, { status: 503 });
  }

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }); }

  const { profile } = body as { profile: unknown };
  if (!profile) return Response.json({ error: 'profile is required' }, { status: 400 });

  const profileStr = JSON.stringify(profile).substring(0, 15000);

  const prompt = `Analyze this student portfolio profile and provide structured feedback.

PROFILE:
${profileStr}

Return JSON:
{
  "completenessScore": 0-100,
  "strengths": ["strength 1", "strength 2"],
  "gaps": ["missing item 1", "missing item 2"],
  "recommendations": ["action 1", "action 2", "action 3"],
  "suggestedRoles": ["Role 1", "Role 2"],
  "readinessLevel": "Entry Level|Junior|Mid Level"
}

Base all analysis ONLY on what is provided in the profile. Do not invent information.`;

  try {
    const result = await client.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { temperature: 0.5, maxOutputTokens: 1000, responseMimeType: 'application/json' },
    });
    const text = result.text;
    if (!text) return Response.json({ error: 'Empty response' }, { status: 502 });
    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch { return Response.json({ error: 'Invalid AI response' }, { status: 502 }); }
    return Response.json(parsed);
  } catch (error) {
    console.error('[AI Analyze]', error instanceof Error ? error.message : error);
    return Response.json({ error: 'Analysis failed. Try again.' }, { status: 502 });
  }
}
