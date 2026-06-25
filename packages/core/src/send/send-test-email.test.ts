import { describe, expect, it, vi } from 'vitest';

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' })
    })
  }
}));

import { sendTestEmail } from '../index.js';
import nodemailer from 'nodemailer';

describe('sendTestEmail', () => {
  it('sends rendered html to recipient', async () => {
    const messageId = await sendTestEmail({
      transportConfig: {
        host: 'smtp.example.com',
        port: 587,
        secure: false,
        auth: { user: 'user', pass: 'pass' }
      },
      mail: {
        from: 'sender@example.com',
        to: 'receiver@example.com',
        subject: 'Preview',
        html: '<p>Hello</p>'
      }
    });
    expect(nodemailer.createTransport).toHaveBeenCalled();
    const transport = vi.mocked(nodemailer.createTransport).mock.results[0]?.value;
    expect(transport.sendMail).toHaveBeenCalledWith({
      from: 'sender@example.com',
      to: 'receiver@example.com',
      subject: 'Preview',
      html: '<p>Hello</p>'
    });
    expect(messageId).toBe('test-id');
  });
});
