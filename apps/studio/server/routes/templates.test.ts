import { describe, expect, it, vi } from 'vitest';

const summaries = [
  {
    id: 'welcome',
    name: 'Welcome',
    preview: 'Welcome message',
    tokens: [
      { expression: 'first_name', key: 'first_name', label: 'First Name', defaultValue: 'Ava', inputType: 'text' }
    ]
  }
];

const { loadConfig, getTemplateSummaries } = vi.hoisted(() => ({
  loadConfig: vi.fn().mockResolvedValue({ rootDir: '/tmp', pagesDir: '/tmp/src/pages', componentsDir: '/tmp/src/components', stylesDir: '/tmp/src/styles', outDir: '/tmp/dist' }),
  getTemplateSummaries: vi.fn()
}));

vi.mock('@email-template-studio/core', () => ({ loadConfig, getTemplateSummaries }));

import { getTemplates } from './templates.js';

describe('getTemplates', () => {
  it('returns full template summaries including tokens and preview', async () => {
    getTemplateSummaries.mockResolvedValueOnce(summaries);
    const result = await getTemplates();
    expect(result).toEqual(summaries);
  });
});
