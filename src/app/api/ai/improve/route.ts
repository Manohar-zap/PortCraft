import type { NextRequest } from 'next/server';
import { generateGeminiContent, hasGeminiConfigured } from '@/lib/ai/geminiClient';

export async function POST(request: NextRequest) {
  if (!hasGeminiConfigured()) {
    return Response.json({ error: 'AI features not configured. Add GEMINI_API_KEY.' }, { status: 503 });
  }

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }); }

  const { section, currentContent, context, instruction } = body as {
    section: string;
    currentContent: string;
    context?: string;
    instruction?: string;
  };

  if (!section || !currentContent) {
    return Response.json({ error: 'section and currentContent are required' }, { status: 400 });
  }

  const cleanContent = String(currentContent).substring(0, 2000);
  const cleanContext = String(context || '').substring(0, 3000);
  const cleanInstruction = String(instruction || '').substring(0, 500);

  const prompt = `You are a professional portfolio content writer.

Improve the following ${section} for a student/developer portfolio.

CURRENT CONTENT:
${cleanContent}

PROFILE CONTEXT:
${cleanContext}

SPECIFIC INSTRUCTION: ${cleanInstruction || 'Make it more professional and impactful.'}

Return ONLY the improved content as a JSON object:
{
  "improved": "The improved version of the content",
  "changes": "Brief explanation of what was changed and why"
}

Rules:
- Keep facts accurate — do not add information that is not in the context
- Keep length similar unless asked to change it
- Write naturally, not like a template`;

  try {
    const result = await generateGeminiContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      temperature: 0.7,
      maxOutputTokens: 800,
      responseMimeType: 'application/json',
    });

    const text = result.text;
    if (!text) return Response.json({ error: 'Empty response' }, { status: 502 });

    let parsed: unknown;
    try { parsed = JSON.parse(text); } catch {
      return Response.json({ improved: text, changes: 'Content improved.' });
    }
    return Response.json(parsed);
  } catch (error) {
    console.error('[AI Improve]', error instanceof Error ? error.message : error);
    return Response.json({ error: 'Improvement failed. Try again.' }, { status: 502 });
  }
}
