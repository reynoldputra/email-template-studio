import type { PreviewMode } from '../types.js';

export const PreviewFrame = ({ html, mode }: { html: string; mode: PreviewMode }) => {
  const className = mode === 'phone' ? 'preview-frame preview-phone' : 'preview-frame preview-desktop';
  return <iframe className={className} title="Template preview" srcDoc={html} />;
};
