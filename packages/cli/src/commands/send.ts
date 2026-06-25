import 'dotenv/config.js';
import { loadConfig, renderPreview, sendTestEmail } from '@email-template-studio/core';
import { formatOutput } from '../format-output.js';

export const runSend = async ({ to, template }: { to: string; template: string }) => {
  const config = await loadConfig({ cwd: process.cwd() });
  const html = await renderPreview({ config, templateId: template, values: {} });
  const messageId = await sendTestEmail({
    transportConfig: {
      host: process.env.SMTP_HOST ?? '',
      port: Number(process.env.SMTP_PORT ?? '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER ?? '',
        pass: process.env.SMTP_PASS ?? ''
      }
    },
    mail: {
      from: process.env.SMTP_FROM ?? 'studio@example.com',
      to,
      subject: `Preview: ${template}`,
      html
    }
  });
  return formatOutput([`Sent ${template} to ${to}`, `Message ID: ${messageId}`]);
};
