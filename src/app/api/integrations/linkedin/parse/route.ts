import type { NextRequest } from 'next/server';
import { generateGeminiContent, hasGeminiConfigured } from '@/lib/ai/geminiClient';
import { parseLinkedInText } from '@/lib/integrations/linkedin/parser';
import { generateId } from '@/lib/types';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { text } = (body || {}) as { text?: string };
  if (!text || typeof text !== 'string' || !text.trim()) {
    return Response.json({ error: 'LinkedIn text is required' }, { status: 400 });
  }

  const cleanText = text.substring(0, 25000);

  // Try Gemini AI if available
  if (hasGeminiConfigured()) {
    try {
      const prompt = `You are a resume and LinkedIn data parser. Extract Education and Skills from the following LinkedIn profile text or export into structured JSON:

RAW LINKEDIN TEXT:
${cleanText}

REQUIRED JSON OUTPUT FORMAT:
{
  "education": [
    {
      "institution": "University / College name",
      "degree": "Degree name (e.g. Bachelor of Science, B.Tech)",
      "field": "Field of Study (e.g. Computer Science)",
      "startYear": "Start year (e.g. 2020)",
      "endYear": "End year (e.g. 2024 or Present)",
      "gpa": "GPA if mentioned, else empty string",
      "description": "Relevant activities, honors or description if mentioned"
    }
  ],
  "skills": [
    {
      "name": "Skill name",
      "category": "Frontend|Backend|DevOps|Data Science|Mobile|Tools|Languages|Other",
      "level": 0
    }
  ]
}

Only extract information that is present in the text. Do not invent universities or skills.
Return ONLY valid JSON.`;

      const result = await generateGeminiContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        temperature: 0.2,
        maxOutputTokens: 2500,
        responseMimeType: 'application/json',
      });

      const responseText = result.text;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        const education = (parsed.education || []).map((e: {
          institution?: string;
          degree?: string;
          field?: string;
          startYear?: string;
          endYear?: string;
          gpa?: string;
          description?: string;
        }) => ({
          id: generateId(),
          institution: e.institution || '',
          degree: e.degree || '',
          field: e.field || '',
          startYear: e.startYear || '',
          endYear: e.endYear || '',
          gpa: e.gpa || '',
          description: e.description || '',
        }));

        const skills = (parsed.skills || []).map((s: {
          name?: string;
          category?: string;
          level?: number;
        }) => ({
          id: generateId(),
          name: s.name || '',
          category: s.category || 'Tools',
          level: typeof s.level === 'number' ? Math.max(0, Math.min(5, s.level)) : 0,
        }));

        return Response.json({
          success: true,
          source: 'gemini',
          education,
          skills,
        });
      }
    } catch (err) {
      console.warn('[LinkedIn Parse] AI extraction failed, falling back to deterministic parser:', err);
    }
  }

  // Fallback to deterministic client/server parser
  const fallbackResult = parseLinkedInText(cleanText);
  return Response.json({
    success: true,
    source: 'deterministic',
    education: fallbackResult.education,
    skills: fallbackResult.skills,
  });
}
