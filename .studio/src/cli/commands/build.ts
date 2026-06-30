import { buildAllTemplates, loadConfig } from '../../core/index.js';
import { formatOutput } from '../format-output.js';

export const runBuild = async () => {
  const config = await loadConfig({ cwd: process.cwd() });
  const results = await buildAllTemplates(config);
  return formatOutput(results.map((result) => `Built ${result.templateId} -> ${result.outFile}`));
};
