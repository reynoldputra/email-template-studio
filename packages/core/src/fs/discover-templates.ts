import fs from 'node:fs/promises';
import path from 'node:path';
import type { TemplateDescriptor, TemplateProjectConfig } from '../types.js';

const formatName = (id: string) =>
  id
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const discoverTemplates = async (config: TemplateProjectConfig): Promise<TemplateDescriptor[]> => {
  const entries = await fs.readdir(config.pagesDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mjml'))
    .map((entry) => {
      const id = entry.name.replace(/\.mjml$/, '');
      return {
        id,
        name: formatName(id),
        filePath: path.join(config.pagesDir, entry.name)
      } satisfies TemplateDescriptor;
    })
    .sort((left, right) => left.id.localeCompare(right.id));
};
