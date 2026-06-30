import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['.studio/src/**/*.test.ts', '.studio/src/**/*.test.tsx'],
    environment: 'node',
    environmentMatchGlobs: [
      ['.studio/src/studio/client/**', 'jsdom'],
    ],
    globals: false
  }
});
