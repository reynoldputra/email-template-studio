import { discoverTemplates, loadConfig } from '@email-template-studio/core';
import type { StudioTemplateListItem } from '../../src/types.js';
import { resolveStudioProjectRoot } from '../project-root.js';

export const getTemplates = async (): Promise<StudioTemplateListItem[]> => {
  const config = await loadConfig({ cwd: resolveStudioProjectRoot() });
  const templates = await discoverTemplates(config);
  return templates.map(({ id, name }) => ({ id, name }));
};
