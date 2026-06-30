declare module 'mjml' {
  type MjmlError = { formattedMessage: string };
  type MjmlResult = { html: string; errors: MjmlError[] };
  export default function mjml2html(source: string, options?: Record<string, unknown>): MjmlResult;
}
