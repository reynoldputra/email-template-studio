import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { createServer } from 'vite';
import { createStudioServer } from '../../studio/server/dev-server.js';

const studioRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');

export const runDev = async () => {
  const API_PORT = Number(process.env.STUDIO_API_PORT ?? '3101');
  const VITE_PORT = Number(process.env.STUDIO_PORT ?? '3100');

  // Start Express API server
  const app = createStudioServer();
  await new Promise<void>((resolve) => app.listen(API_PORT, '127.0.0.1', () => resolve()));

  // Start Vite dev server with proxy to Express
  const vite = await createServer({
    plugins: [react()],
    root: path.join(studioRoot, '.studio/src/studio/client'),
    resolve: {
      // ESM source uses .js extensions; Vite maps them to .ts at dev time
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    optimizeDeps: {
      // suppress false-missing warnings — modules resolve fine from repo root
      include: [],
    },
    server: {
      port: VITE_PORT,
      host: '127.0.0.1',
      fs: { allow: [studioRoot] },
      proxy: {
        '^/api/(templates|preview|send|validate)': {
          target: `http://127.0.0.1:${API_PORT}`,
          rewrite: (p) => p,
        },
      },
    },
  });

  await vite.listen();
  vite.printUrls();
};
