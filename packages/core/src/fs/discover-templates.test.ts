import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { discoverTemplates, loadConfig } from '../index.js';

const fixtureRoot = path.resolve('packages/core/test/fixtures/project-a');

describe('discoverTemplates', () => {
  it('finds mjml pages and returns sorted descriptors', async () => {
    const config = await loadConfig({ cwd: fixtureRoot });
    const templates = await discoverTemplates(config);
    expect(templates.map((item) => item.id)).toEqual(['reset-password', 'welcome', 'with-variable']);
  });
});
