import { AIExplanation, ChatMessage, DeepDiveMode, DeepDiveResult } from '../types';

/**
 * Thin client for the server-side Gemini proxy (/api/gemini). The browser never
 * sees the API key — all model calls are made server-side (Vite dev middleware
 * in development, the serverless function in production).
 */
async function postGemini<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Unexpected server response (${res.status}).`);
  }
  if (!res.ok || data?.error) {
    throw new Error(data?.error || `Request failed (${res.status}).`);
  }
  return data as T;
}

export async function getExplanation(
  messages: ChatMessage[],
  context: string,
): Promise<AIExplanation> {
  return postGemini<AIExplanation>({ task: 'explain', messages, context });
}

export async function generateDeepDive(
  text: string,
  mode: DeepDiveMode,
): Promise<DeepDiveResult> {
  return postGemini<DeepDiveResult>({ task: 'deepdive', text, mode });
}

export async function generateDeepDiveImage(
  explanation: string,
  style: string,
): Promise<string> {
  const data = await postGemini<{ imageUrl: string }>({ task: 'image', explanation, style });
  return data.imageUrl;
}

export async function generateDeepDiveAudio(text: string): Promise<string> {
  const data = await postGemini<{ audioUrl: string }>({ task: 'audio', text });
  return data.audioUrl;
}
