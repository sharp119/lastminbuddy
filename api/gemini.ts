import { handleGemini } from '../server/gemini';

/**
 * Vercel serverless function. Set GEMINI_API_KEY in the Vercel project env.
 * The browser POSTs { task, ...payload } here; the key stays server-side.
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const result = await handleGemini(body);
    res.status(200).json(result);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Server error' });
  }
}
