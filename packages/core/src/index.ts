export { loadConfig } from './config/load-config.js';
export { discoverTemplates } from './fs/discover-templates.js';
export { getTemplateSummaries } from './fs/get-template-summaries.js';
export { extractVariables } from './variables/extract-variables.js';
export { extractTemplatePreview } from './variables/extract-template-preview.js';
export { interpolateVariables } from './render/interpolate-variables.js';
export { renderPreview } from './render/render-preview.js';
export { buildAllTemplates } from './output/build-all-templates.js';
export { validateTemplateProject } from './validate/validate-template-project.js';
export { sendTestEmail } from './send/send-test-email.js';
export type { TransportConfig } from './send/create-transport.js';
export type {
  BuildResult,
  TemplateDescriptor,
  TemplateProjectConfig,
  TemplateSummary,
  TemplateVariable,
  VariableInputType
} from './types.js';
