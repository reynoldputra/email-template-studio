import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { buildAllTemplates, loadConfig } from '../index.js';

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('buildAllTemplates', () => {
  it('writes compiled html files to outDir', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ets-'));
    tempRoots.push(root);
    await fs.mkdir(path.join(root, 'src/pages'), { recursive: true });
    await fs.writeFile(path.join(root, 'src/pages/welcome.mjml'), '<mjml><mj-body><mj-section><mj-column><mj-text>Welcome</mj-text></mj-column></mj-section></mj-body></mjml>');
    const config = await loadConfig({ cwd: root });
    const result = await buildAllTemplates(config);
    const html = await fs.readFile(path.join(root, 'dist/welcome.html'), 'utf8');
    expect(result).toEqual([{ templateId: 'welcome', outFile: path.join(root, 'dist/welcome.html') }]);
    expect(html).toContain('Welcome');
  });
});
