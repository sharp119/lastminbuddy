/**
 * Server-side Gemini logic shared by the Vite dev middleware (vite.config.ts)
 * and the Vercel serverless function (api/gemini.ts).
 *
 * The GEMINI_API_KEY is read from server env only and is never sent to the
 * browser. All four tasks (explain / deepdive / image / audio) are routed here.
 */

const BASE = 'https://generativelanguage.googleapis.com/v1beta';

type Body = Record<string, any>;

function apiKey(): string {
  const k = process.env.GEMINI_API_KEY;
  if (!k) throw new Error('GEMINI_API_KEY is not configured on the server.');
  return k;
}

async function callModel(model: string, payload: Body): Promise<any> {
  const res = await fetch(`${BASE}/models/${model}:generateContent?key=${apiKey()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini "${model}" error ${res.status}: ${txt.slice(0, 500)}`);
  }
  return res.json();
}

function extractText(data: any): string {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.map((p: any) => p.text || '').join('').trim();
}

function findInlineData(data: any): { mimeType: string; data: string } | null {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    const inline = p.inlineData || p.inline_data;
    if (inline?.data) return { mimeType: inline.mimeType || inline.mime_type || '', data: inline.data };
  }
  return null;
}

function stripFences(s: string): string {
  return s
    .replace(/^\s*```(?:json)?/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

/** Wrap raw little-endian PCM16 (what Gemini TTS returns) in a WAV container so
 *  browsers can play it from a data URL. */
function pcmToWavDataUrl(base64Pcm: string, mimeType: string): string {
  const rateMatch = /rate=(\d+)/.exec(mimeType);
  const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
  const pcm = Buffer.from(base64Pcm, 'base64');
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return `data:audio/wav;base64,${Buffer.concat([header, pcm]).toString('base64')}`;
}

const EXPLAIN_SYSTEM = `You are an expert exam professor helping a student score full marks. Output a SINGLE valid JSON object and NOTHING else (no markdown code fences).

JSON schema:
{
  "summary": "one concise sentence",
  "answer_content": "the full answer in Markdown",
  "sources": [{ "title": "string", "url": "https://...", "match_type": "exact" | "related" }],
  "visuals": [{ "type": "mermaid" | "react_flow" | "recharts", "title": "string", "data": "string", "description": "string" }]
}

RULES:
- Mark-aware depth. 2-3 marks: ~100-250 words, core definition + one example. 4-5 marks: ~250-400 words. 6+ marks or unspecified: 350-500 words with intro, detailed points, conclusion.
- Solver mode. If the task asks to Design/Draw/Calculate/Convert/Solve, drop all introductions and give numbered zero-fluff steps; put each transformation stage as its own visual.
- Examiner keywords. Wrap the exact terms a marker rewards in **double asterisks**.
- Always show worked steps and maths. Use $$ ... $$ for block formulas. Include a concrete example.
- Visuals (generate multiple when the answer has multiple parts; empty array if none help):
  * mermaid -> flowcharts/state/sequence. ASCII labels ONLY. Wrap any label containing special characters in double quotes. Never use Greek letters or unicode math symbols (write "Delta U", ">=").
  * react_flow -> hierarchies/mind maps. data is a JSON array mixing nodes {"id","label","nodeType":"root"|"definition"|"example"} and edges {"source","target"}.
  * recharts -> data/trends/functions. data is a JSON string: {"type":"LineChart"|"BarChart"|"AreaChart","xAxisKey":"name","data":[...],"series":[{"dataKey","name","color"}]}. Use 15-20 points for smooth curves.
- Grounding. Search the exact question text verbatim AND the underlying concept. Prefer sources matching the exact problem and flag them "match_type":"exact"; others "related". Never fabricate URLs.
- Silent source. Answer as the expert; never say "according to the document/PDF".`;

const ELI5_SYSTEM = `You are a friendly teacher explaining a concept to a curious beginner.
- If it is conceptual: use a vivid, fun analogy or metaphor.
- If it contains a FORMULA: break down every variable, explain how changing one variable changes the result, give the intuition for why it exists, and a catchy mnemonic.
Keep it under 200 words. Markdown allowed; bold key terms with **double asterisks**.`;

const NOTES_SYSTEM = `You are an expert tutor writing high-quality revision notes.
Structure: a precise **Definition**, 3-4 **Key Points** bullets, and a short **Exam Context** noting how it is tested or common pitfalls.
Formal, concise, optimized for quick revision. Under 250 words. Bold keywords with **double asterisks**.`;

async function explain(body: Body) {
  const messages = (body.messages || []) as { role: string; content: any }[];
  const context: string = body.context || '';

  const contents = messages.map((m, i) => {
    let text = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
    if (i === 0 && context) text += `\n\n${context}`;
    return { role: m.role === 'ai' ? 'model' : 'user', parts: [{ text }] };
  });

  const base: Body = {
    systemInstruction: { parts: [{ text: EXPLAIN_SYSTEM }] },
    contents,
  };

  // Try with Google Search grounding; fall back without it if the field is rejected.
  let data: any;
  try {
    data = await callModel('gemini-2.0-flash', { ...base, tools: [{ google_search: {} }] });
  } catch {
    data = await callModel('gemini-2.0-flash', base);
  }

  const raw = stripFences(extractText(data));
  try {
    return JSON.parse(raw);
  } catch {
    return { summary: 'Answer', answer_content: raw || 'No answer generated.', sources: [], visuals: [] };
  }
}

async function deepdive(body: Body) {
  const mode = body.mode === 'notes' ? 'notes' : 'eli5';
  const system = mode === 'notes' ? NOTES_SYSTEM : ELI5_SYSTEM;
  const data = await callModel('gemini-2.5-flash', {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts: [{ text: `Concept: "${body.text}"` }] }],
  });
  return { explanation: extractText(data) || 'Could not generate explanation.', mode, sourceText: body.text };
}

async function image(body: Body) {
  const prompt = `Create a clear visual representation of this explanation for a student:\n\n"${body.explanation}"\n\nVISUAL STYLE: ${body.style}\nHigh quality, detailed, no text labels.`;
  const data = await callModel('gemini-2.5-flash-image', {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['IMAGE'] },
  });
  const inline = findInlineData(data);
  if (!inline) throw new Error('The image model returned no image. Try a different style.');
  return { imageUrl: `data:${inline.mimeType || 'image/png'};base64,${inline.data}` };
}

async function audio(body: Body) {
  const data = await callModel('gemini-2.5-flash-preview-tts', {
    contents: [
      { role: 'user', parts: [{ text: `Read this aloud in a warm, friendly, storytelling tone:\n\n"${body.text}"` }] },
    ],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  });
  const inline = findInlineData(data);
  if (!inline) throw new Error('No audio returned from the TTS model.');
  const mime = inline.mimeType || '';
  const audioUrl = /wav|mp3|ogg/i.test(mime)
    ? `data:${mime};base64,${inline.data}`
    : pcmToWavDataUrl(inline.data, mime);
  return { audioUrl };
}

export async function handleGemini(body: Body): Promise<any> {
  switch (body?.task) {
    case 'explain':
      return explain(body);
    case 'deepdive':
      return deepdive(body);
    case 'image':
      return image(body);
    case 'audio':
      return audio(body);
    default:
      throw new Error(`Unknown task: ${body?.task}`);
  }
}
