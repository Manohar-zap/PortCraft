import type { NextRequest } from 'next/server';
import { generateGeminiContent, hasGeminiConfigured } from '@/lib/ai/geminiClient';

const MAX_INPUT_LENGTH = 20000;

export async function POST(request: NextRequest) {
  if (!hasGeminiConfigured()) {
    return Response.json({ error: 'AI features are not configured. Add GEMINI_API_KEY to environment variables.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Validate body shape
  if (typeof body !== 'object' || body === null) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { profile, instructions, theme } = body as { profile: unknown; instructions?: string; theme?: string };
  if (!profile) return Response.json({ error: 'profile is required' }, { status: 400 });

  // Sanitize and limit size
  const profileStr = JSON.stringify(profile).substring(0, MAX_INPUT_LENGTH);
  const cleanInstructions = typeof instructions === 'string'
    ? instructions.substring(0, 500)
    : '';

  const prompt = `You are a professional portfolio content writer helping a student or early-career developer create an impressive portfolio.

Given the following student profile data (collected from verified sources like GitHub, LeetCode, Codeforces):

PROFILE DATA:
${profileStr}

CUSTOMIZATION INSTRUCTIONS: ${cleanInstructions || 'Create a professional, balanced portfolio suitable for tech roles.'}
SELECTED THEME: ${theme || 'professional'}

Generate portfolio content in this EXACT JSON format:
{
  "bio": "A compelling 2-3 sentence professional bio in first person",
  "headline": "A concise professional headline (max 10 words)",
  "projectDescriptions": {
    "[projectId]": "An improved 2-sentence project description highlighting technical impact"
  },
  "skillHighlights": "A 1-sentence summary of strongest technical skills",
  "careerObjective": "A 1-2 sentence career objective appropriate for the student's level",
  "improvements": ["List of 3-5 specific suggestions to improve the portfolio"]
}

IMPORTANT RULES:
- Only describe what is ACTUALLY in the profile data
- Do NOT fabricate degrees, certifications, job titles, companies, project results, or scores
- If a field has no data, use null or omit it
- Write naturally, not like a template
- Keep descriptions factual and verifiable

Return ONLY valid JSON, no markdown, no explanation.`;

  try {
    const result = await generateGeminiContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      temperature: 0.7,
      maxOutputTokens: 2000,
      responseMimeType: 'application/json',
    });

    const text = result.text;
    if (!text) return Response.json({ error: 'Empty response from AI' }, { status: 502 });

    // Parse and validate
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return Response.json({ error: 'AI returned invalid JSON' }, { status: 502 });
    }

    return Response.json({ success: true, content: parsed, model: result.model });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'AI generation failed';
    // Don't expose internal error details
    console.error('[AI Generate] Error:', msg);
    return Response.json({ error: 'Portfolio generation failed. Please try again.' }, { status: 502 });
  }
}
