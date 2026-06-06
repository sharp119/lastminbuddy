import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { handleGemini } from './server/gemini';

/**
 * Dev-only middleware that mirrors the Vercel serverless function in
 * /api/gemini.ts. It lets `npm run dev` run the full stack locally:
 * the browser POSTs to /api/gemini, this proxy injects the server-side
 * GEMINI_API_KEY and forwards to Google. The key never reaches the client.
 */
function devApi(env: Record<string, string>): Plugin {
  return {
    name: 'lastminbuddy-dev-api',
    apply: 'serve',
    configureServer(server) {
      if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
      server.middlewares.use('/api/gemini', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }
        try {
          const chunks: Buffer[] = [];
          for await (const c of req as any) chunks.push(c as Buffer);
          const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
          const result = await handleGemini(body);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (e: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: e?.message || 'Server error' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), devApi(env)],
  };
});
