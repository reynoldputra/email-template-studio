import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@email-template-studio/core': path.resolve(__dirname, 'packages/core/src/index.ts')
    }
  },
  test: {
    include: ['packages/**/*.test.ts', 'packages/**/*.test.tsx', 'apps/**/*.test.ts', 'apps/**/*.test.tsx'],
    exclude: ['**/node_modules/**', 'apps/studio/e2e/**']
  }
});
