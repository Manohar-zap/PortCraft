import type { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const MAX_HISTORY = 10; // Keep last 10 messages
const MAX_MESSAGE_LENGTH = 1000;
const MAX_PROFILE_LENGTH = 15000;

function getClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ProposedAction {
  type: 'update_bio' | 'update_headline' | 'update_project' | 'switch_theme' | 'add_skill' | 'reorder_projects';
  field?: string;
  currentValue?: string;
  proposedValue?: string;
  metadata?: Record<string, unknown>;
  description: string;
}

export async function POST(request: NextRequest) {
  const client = getClient();
  if (!client) {
    return Response.json({ error: 'AI features are not configured. Add GEMINI_API_KEY.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { message, history, portfolioContext, selectedTheme } = body as {
    message: string;
    history?: ChatMessage[];
    portfolioContext?: unknown;
    selectedTheme?: string;
  };

  if (!message || typeof message !== 'string') {
    return Response.json({ error: 'message is required' }, { status: 400 });
  }

  const cleanMessage = message.substring(0, MAX_MESSAGE_LENGTH);
  const cleanHistory = (Array.isArray(history) ? history : []).slice(-MAX_HISTORY);
  const contextStr = JSON.stringify(portfolioContext || {}).substring(0, MAX_PROFILE_LENGTH);

  const systemPrompt = `You are PortCraft AI, an intelligent portfolio assistant helping students create professional portfolios.

You have access to the student's current portfolio data and selected theme. You can:
1. Suggest portfolio improvements
2. Rewrite bio, project descriptions, headlines
3. Recommend theme changes
4. Help with content organization

CURRENT PORTFOLIO CONTEXT:
${contextStr}

SELECTED THEME: ${selectedTheme || 'unknown'}

RESPONSE FORMAT: Return a JSON object with:
{
  "message": "Your conversational response to the user",
  "actions": [] // Optional array of proposed changes (or empty array)
}

Each action in the array must have:
{
  "type": "update_bio|update_headline|update_project|switch_theme|add_skill|reorder_projects",
  "description": "Human-readable description of what will change",
  "currentValue": "The current value (string)",
  "proposedValue": "The new proposed value (string)",
  "field": "optional field identifier"
}

RULES:
- NEVER make changes automatically — always propose them as actions for user approval
- Be concise and helpful
- Do not fabricate profile information
- If the user asks to change the theme, include a switch_theme action with the theme ID
- Return ONLY valid JSON`;

  const contents = [
    ...cleanHistory.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user' as const,
      parts: [{ text: h.content }],
    })),
    { role: 'user' as const, parts: [{ text: cleanMessage }] },
  ];

  try {
    const result = await client.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        maxOutputTokens: 1500,
        responseMimeType: 'application/json',
      },
    });

    const text = result.text;
    if (!text) return Response.json({ message: 'No response from AI', actions: [] });

    let parsed: { message: string; actions?: ProposedAction[] };
    try {
      parsed = JSON.parse(text);
    } catch {
      // If JSON parse fails, return as plain message
      return Response.json({ message: text, actions: [] });
    }

    // Validate structure
    if (typeof parsed.message !== 'string') {
      return Response.json({ message: String(parsed), actions: [] });
    }

    return Response.json({
      message: parsed.message,
      actions: Array.isArray(parsed.actions) ? parsed.actions.slice(0, 5) : [],
      model: MODEL,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'AI chat failed';
    console.error('[AI Chat] Error:', msg);
    return Response.json({ message: 'I encountered an issue. Please try again.', actions: [] });
  }
}
