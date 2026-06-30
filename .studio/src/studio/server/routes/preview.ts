import { loadConfig, renderPreview } from '../../../core/index.js';
import { resolveStudioProjectRoot } from '../project-root.js';

export const getPreview = async (templateId: string, values: Record<string, string>) => {
  const config = await loadConfig({ cwd: resolveStudioProjectRoot() });
  return renderPreview({ config, templateId, values });
};
