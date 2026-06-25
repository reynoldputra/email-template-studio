import 'dotenv/config.js';
import { loadConfig, renderPreview, sendTestEmail } from '@email-template-studio/core';
import { resolveStudioProjectRoot } from '../project-root.js';

export const postSend = async (templateId: string, to: string, values: Record<string, string>) => {
  const config = await loadConfig({ cwd: resolveStudioProjectRoot() });
  const html = await renderPreview({ config, templateId, values });
  return sendTestEmail({
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
      subject: `Preview: ${templateId}`,
      html
    }
  });
};
