import { loadConfig, validateTemplateProject } from '@email-template-studio/core';
import { resolveStudioProjectRoot } from '../project-root.js';

export const getValidation = async () => {
  const config = await loadConfig({ cwd: resolveStudioProjectRoot() });
  await validateTemplateProject(config);
  return { ok: true };
};
