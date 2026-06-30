import type { TemplateVariable } from '../types.js';
import { deriveVariableMeta } from './derive-variable-meta.js';

const pattern = /\{\{\s*([^}]+?)\s*\}\}/g;

export const extractVariables = (source: string): TemplateVariable[] => {
  const seen = new Set<string>();
  const results: TemplateVariable[] = [];

  for (const match of source.matchAll(pattern)) {
    const expression = match[1].trim();
    if (seen.has(expression)) continue;
    seen.add(expression);
    results.push(deriveVariableMeta(expression));
  }

  return results;
};
