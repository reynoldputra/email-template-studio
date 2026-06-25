import { createTransport, type TransportConfig } from './create-transport.js';

export const sendTestEmail = async ({
  transportConfig,
  mail
}: {
  transportConfig: TransportConfig;
  mail: {
    from: string;
    to: string;
    subject: string;
    html: string;
  };
}): Promise<string> => {
  const result = await createTransport(transportConfig).sendMail(mail);
  return result.messageId;
};
