export const extractTemplatePreview = (source: string): string => {
  const match = source.match(/<mj-preview[^>]*>([\s\S]*?)<\/mj-preview>/i);
  return match ? match[1].trim() : '';
};
