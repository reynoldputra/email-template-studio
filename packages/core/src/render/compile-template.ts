import path from 'node:path';
import mjml2html from 'mjml';

export const compileTemplate = async (source: string, filePath?: string): Promise<string> => {
  const result = await mjml2html(source, {
    filePath: filePath ? path.dirname(filePath) : undefined,
    validationLevel: 'strict'
  });

  if (result.errors.length > 0) {
    throw new Error(result.errors.map((error: { formattedMessage: string }) => error.formattedMessage).join('\n'));
  }

  return result.html;
};
