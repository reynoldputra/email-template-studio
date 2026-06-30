import { loadConfig, validateTemplateProject } from '../../../core/index.js';
import { resolveStudioProjectRoot } from '../project-root.js';

export const getValidation = async () => {
  const config = await loadConfig({ cwd: resolveStudioProjectRoot() });
  await validateTemplateProject(config);
  return { ok: true };
};
