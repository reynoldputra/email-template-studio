import { describe, expect, it } from 'vitest';
import { loadConfig } from '../index.js';

describe('loadConfig', () => {
  it('applies defaults from root dir', async () => {
    const config = await loadConfig({ cwd: '/repo/example' });
    expect(config.rootDir).toBe('/repo/example');
    expect(config.pagesDir).toBe('/repo/example/src/pages');
    expect(config.componentsDir).toBe('/repo/example/src/components');
    expect(config.stylesDir).toBe('/repo/example/src/styles');
    expect(config.outDir).toBe('/repo/example/dist');
  });
});
