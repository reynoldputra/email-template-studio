import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export default defineConfig({
  plugins: [react()],
  root: path.join(root, '.studio/src/studio/client'),
  build: {
    outDir: path.join(root, '.studio/static/studio'),
    emptyOutDir: true,
  },
});
