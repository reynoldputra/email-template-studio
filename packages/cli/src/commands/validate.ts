import { loadConfig, validateTemplateProject } from '@email-template-studio/core';
import { formatOutput } from '../format-output.js';

export const runValidate = async () => {
  const config = await loadConfig({ cwd: process.cwd() });
  await validateTemplateProject(config);
  return formatOutput(['Validation passed']);
};
