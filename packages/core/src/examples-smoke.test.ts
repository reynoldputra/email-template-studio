import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildAllTemplates, loadConfig } from './index.js';

describe('examples/basic', () => {
  it('builds all generic templates', async () => {
    const cwd = path.resolve('examples/basic');
    const config = await loadConfig({ cwd });
    const results = await buildAllTemplates(config);
    expect(results.map((item) => item.templateId)).toEqual(['invoice', 'notification', 'reset-password', 'welcome']);
  });
});
