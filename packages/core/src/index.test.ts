import { describe, expect, it } from 'vitest';
import * as core from './index.js';

describe('core package exports', () => {
  it('exports public api functions', () => {
    expect(typeof core.loadConfig).toBe('function');
    expect(typeof core.discoverTemplates).toBe('function');
    expect(typeof core.getTemplateSummaries).toBe('function');
    expect(typeof core.extractVariables).toBe('function');
    expect(typeof core.extractTemplatePreview).toBe('function');
    expect(typeof core.interpolateVariables).toBe('function');
    expect(typeof core.renderPreview).toBe('function');
    expect(typeof core.buildAllTemplates).toBe('function');
    expect(typeof core.validateTemplateProject).toBe('function');
    expect(typeof core.sendTestEmail).toBe('function');
  });
});
