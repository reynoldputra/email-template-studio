import { describe, expect, it, vi } from 'vitest';

const { loadConfig, discoverTemplates } = vi.hoisted(() => ({
  loadConfig: vi.fn().mockResolvedValue({ rootDir: '/tmp', pagesDir: '/tmp/src/pages', componentsDir: '/tmp/src/components', stylesDir: '/tmp/src/styles', outDir: '/tmp/dist' }),
  discoverTemplates: vi.fn().mockResolvedValue([{ id: 'welcome', name: 'Welcome', filePath: '/tmp/src/pages/welcome.mjml' }])
}));

vi.mock('@email-template-studio/core', () => ({ loadConfig, discoverTemplates }));

import { getTemplates } from './templates.js';

describe('getTemplates', () => {
  it('returns template list data', async () => {
    const result = await getTemplates();
    expect(result).toEqual([{ id: 'welcome', name: 'Welcome' }]);
  });
});
