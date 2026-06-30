import type { TemplateVariable, VariableInputType } from '../types.js';

const toTitleCase = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (/^[A-Z]{2,}$/.test(word) ? word : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
    .join(' ');

const humanizeExpression = (expression: string) => {
  const lastSegment = expression.trim().split('.').pop() ?? expression.trim();
  const spaced = lastSegment
    .replace(/^\$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
  return toTitleCase(spaced || expression.trim());
};

const normalizeKey = (expression: string) =>
  expression.replace(/[^a-zA-Z0-9]+/g, ' ').trim().toLowerCase().replace(/\s+/g, '_');

const inferDefaultValue = (expression: string): string => {
  const key = expression.toLowerCase();
  if (key.includes('confirmationurl') || key.includes('href') || key.includes('url') || key.includes('link')) {
    return 'https://example.com/confirmation';
  }
  if (key.includes('code')) return 'INVITE-12345';
  if (key.includes('first_name') || key.includes('firstname') || key.includes('first name')) return 'Ava';
  if (key.includes('last_name') || key.includes('lastname') || key.includes('last name')) return 'Patel';
  if (key.includes('email')) return 'ava@example.com';
  if (key.includes('name')) return 'Ava';
  if (key.includes('title')) return 'Sample title';
  if (key.includes('label')) return 'Get started';
  return 'Sample value';
};

const inferInputType = (expression: string): VariableInputType => {
  const key = expression.toLowerCase();
  if (key.includes('email')) return 'email';
  if (key.includes('confirmationurl') || key.includes('href') || key.includes('url') || key.includes('link')) return 'url';
  return 'text';
};

export const deriveVariableMeta = (expression: string): TemplateVariable => ({
  expression,
  key: normalizeKey(expression),
  label: humanizeExpression(expression),
  defaultValue: inferDefaultValue(expression),
  inputType: inferInputType(expression)
});
