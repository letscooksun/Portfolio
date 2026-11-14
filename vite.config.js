import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/*
 * Serves the Vercel functions in /api during `npm run dev` and `npm run preview`,
 * so the frontend talks to the real handlers locally. On Vercel, /api is deployed
 * as serverless functions automatically and this plugin is not involved.
 */
function localApi() {
  const apiDir = fileURLToPath(new URL('./api', import.meta.url));

  const createMiddleware = (loadModule) => async (req, res, next) => {
    const route = (req.url ?? '').split('?')[0].replace(/^\/+|\/+$/g, '');
    // Plain names only: blocks path traversal and mirrors Vercel ignoring _-prefixed files.
    if (!/^[a-z0-9][a-z0-9-]*$/i.test(route)) return next();
    const file = path.join(apiDir, `${route}.js`);
    if (!fs.existsSync(file)) return next();

    try {
      const { default: handler } = await loadModule(file);
      await handler(req, res);
    } catch (error) {
      console.error(`[api/${route}]`, error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, error: 'Internal server error.' }));
      }
    }
  };

  return {
    name: 'local-api',
    configureServer(server) {
      // ssrLoadModule picks up edits to the handler without restarting the dev server.
      server.middlewares.use('/api', createMiddleware((file) => server.ssrLoadModule(file)));
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', createMiddleware((file) => import(pathToFileURL(file).href)));
    },
  };
}

export default defineConfig(({ mode }) => {
  // Make server-only secrets from .env / .env.local visible to the local API handlers.
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key];
  }

  return {
    plugins: [react(), localApi()],
  };
});
