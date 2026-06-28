import { getTemplateSummaries, loadConfig } from '@email-template-studio/core';
import type { StudioTemplateSummary } from '../../src/types.js';
import { resolveStudioProjectRoot } from '../project-root.js';

export const getTemplates = async (): Promise<StudioTemplateSummary[]> => {
  const config = await loadConfig({ cwd: resolveStudioProjectRoot() });
  return getTemplateSummaries(config);
};
