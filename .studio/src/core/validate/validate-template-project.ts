import fs from 'node:fs/promises';
import type { TemplateProjectConfig } from '../types.js';

export const validateTemplateProject = async (config: TemplateProjectConfig): Promise<void> => {
  await fs.access(config.pagesDir);
};
