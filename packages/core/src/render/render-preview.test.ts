import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadConfig, renderPreview } from '../index.js';

const fixtureRoot = path.resolve('packages/core/test/fixtures/project-a');

describe('renderPreview', () => {
  it('renders mjml html with interpolated variables', async () => {
    const config = await loadConfig({ cwd: fixtureRoot });
    const html = await renderPreview({
      config,
      templateId: 'with-variable',
      values: { first_name: 'Rae' }
    });
    expect(html).toContain('Hello Rae');
    expect(html.toLowerCase()).toContain('<!doctype html>');
  });
});
