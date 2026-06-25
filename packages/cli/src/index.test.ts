import { describe, expect, it, vi } from 'vitest';

const { buildAllTemplates, validateTemplateProject, loadConfig } = vi.hoisted(() => ({
  buildAllTemplates: vi.fn().mockResolvedValue([{ templateId: 'welcome', outFile: '/tmp/welcome.html' }]),
  validateTemplateProject: vi.fn().mockResolvedValue(undefined),
  loadConfig: vi.fn().mockResolvedValue({ rootDir: '/tmp', pagesDir: '/tmp/src/pages', componentsDir: '/tmp/src/components', stylesDir: '/tmp/src/styles', outDir: '/tmp/dist' })
}));

vi.mock('@email-template-studio/core', () => ({ buildAllTemplates, loadConfig, validateTemplateProject }));

import { runCli } from './index.js';

describe('runCli', () => {
  it('runs build command', async () => {
    const result = await runCli(['build']);
    expect(buildAllTemplates).toHaveBeenCalled();
    expect(result).toContain('welcome');
  });

  it('runs validate command', async () => {
    const result = await runCli(['validate']);
    expect(validateTemplateProject).toHaveBeenCalled();
    expect(result).toContain('Validation passed');
  });
});
