import fs from 'node:fs/promises';
import path from 'node:path';
import type { TemplateProjectConfig } from '../types.js';

export const readTemplateSource = async (config: TemplateProjectConfig, templateId: string): Promise<string> => {
  return fs.readFile(path.join(config.pagesDir, `${templateId}.mjml`), 'utf8');
};
