import type { TemplateVariable } from '../types.js';

const toWords = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

export const deriveVariableMeta = (expression: string): TemplateVariable => {
  const words = toWords(expression);
  const key = words.toLowerCase().replace(/\s+/g, '_');
  const label = words
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    expression,
    key,
    label,
    defaultValue: label ? `Sample ${label}` : 'Sample Value'
  };
};
