import type { TemplateProjectConfig } from '../types.js';
import { readTemplateSource } from '../fs/read-template-source.js';
import { interpolateVariables } from './interpolate-variables.js';
import { compileTemplate } from './compile-template.js';

export const renderPreview = async ({
  config,
  templateId,
  values
}: {
  config: TemplateProjectConfig;
  templateId: string;
  values: Record<string, string>;
}): Promise<string> => {
  const filePath = `${config.pagesDir}/${templateId}.mjml`;
  const source = await readTemplateSource(config, templateId);
  return compileTemplate(interpolateVariables(source, values), filePath);
};
