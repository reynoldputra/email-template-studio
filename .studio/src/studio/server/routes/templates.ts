import { getTemplateSummaries, loadConfig } from '../../../core/index.js';
import type { StudioTemplateSummary } from '../../client/types.js';
import { resolveStudioProjectRoot } from '../project-root.js';

export const getTemplates = async (): Promise<StudioTemplateSummary[]> => {
  const config = await loadConfig({ cwd: resolveStudioProjectRoot() });
  return getTemplateSummaries(config);
};
