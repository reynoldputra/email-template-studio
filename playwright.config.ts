import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './apps/studio/e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:3100'
  },
  webServer: {
    command: 'pnpm dev:studio',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
