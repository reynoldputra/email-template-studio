const escapeXml = (value: string): string =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/**
 * Replaces every `{{ expression }}` placeholder with the matching value.
 * Values are keyed by the raw expression text (matching the internal tool).
 */
export const interpolateVariables = (source: string, values: Record<string, string>): string =>
  source.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_full, expression: string) => {
    const trimmed = expression.trim();
    const raw = Object.prototype.hasOwnProperty.call(values, trimmed) ? values[trimmed] : '';
    return escapeXml(raw);
  });
