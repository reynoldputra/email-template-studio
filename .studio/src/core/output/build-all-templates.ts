import fs from 'node:fs/promises';
import path from 'node:path';
import type { BuildResult, TemplateProjectConfig } from '../types.js';
import { discoverTemplates } from '../fs/discover-templates.js';
import { renderPreview } from '../render/render-preview.js';
import { validateTemplateProject } from '../validate/validate-template-project.js';

export const buildAllTemplates = async (config: TemplateProjectConfig): Promise<BuildResult[]> => {
  await validateTemplateProject(config);
  await fs.mkdir(config.outDir, { recursive: true });
  const templates = await discoverTemplates(config);
  const results: BuildResult[] = [];

  for (const template of templates) {
    const html = await renderPreview({ config, templateId: template.id, values: {} });
    const outFile = path.join(config.outDir, `${template.id}.html`);
    await fs.writeFile(outFile, html, 'utf8');
    results.push({ templateId: template.id, outFile });
  }

  return results;
};
