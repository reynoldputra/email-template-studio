import { loadConfig, validateTemplateProject } from '../../core/index.js';
import { formatOutput } from '../format-output.js';

export const runValidate = async () => {
  const config = await loadConfig({ cwd: process.cwd() });
  await validateTemplateProject(config);
  return formatOutput(['Validation passed']);
};
