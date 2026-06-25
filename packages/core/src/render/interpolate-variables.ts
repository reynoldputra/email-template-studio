const toKey = (expression: string) =>
  expression.replace(/[^a-zA-Z0-9]+/g, ' ').trim().toLowerCase().replace(/\s+/g, '_');

export const interpolateVariables = (source: string, values: Record<string, string>): string => {
  return source.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_full, expression: string) => values[toKey(expression.trim())] ?? '');
};
