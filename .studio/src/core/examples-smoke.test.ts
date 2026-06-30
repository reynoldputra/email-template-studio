import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildAllTemplates, loadConfig } from './index.js';

describe('template workspace smoke', () => {
  it('builds all templates and every result succeeds', async () => {
    const cwd = path.resolve('.');
    const config = await loadConfig({ cwd });
    const results = await buildAllTemplates(config);
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.outFile).toBeTruthy();
    }
  });
});
