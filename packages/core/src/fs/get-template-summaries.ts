import type { TemplateProjectConfig, TemplateSummary } from '../types.js';
import { discoverTemplates } from './discover-templates.js';
import { readTemplateSource } from './read-template-source.js';
import { extractVariables } from '../variables/extract-variables.js';
import { extractTemplatePreview } from '../variables/extract-template-preview.js';

export const getTemplateSummaries = async (config: TemplateProjectConfig): Promise<TemplateSummary[]> => {
  const templates = await discoverTemplates(config);
  return Promise.all(
    templates.map(async (template) => {
      const source = await readTemplateSource(config, template.id);
      return {
        id: template.id,
        name: template.name,
        preview: extractTemplatePreview(source),
        tokens: extractVariables(source)
      };
    })
  );
};
