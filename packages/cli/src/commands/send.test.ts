import { describe, expect, it, vi } from 'vitest';

const { loadConfig, renderPreview, sendTestEmail } = vi.hoisted(() => ({
  loadConfig: vi.fn().mockResolvedValue({ rootDir: '/tmp', pagesDir: '/tmp/src/pages', componentsDir: '/tmp/src/components', stylesDir: '/tmp/src/styles', outDir: '/tmp/dist' }),
  renderPreview: vi.fn().mockResolvedValue('<p>Hello</p>'),
  sendTestEmail: vi.fn().mockResolvedValue('message-id')
}));

vi.mock('@email-template-studio/core', () => ({ loadConfig, renderPreview, sendTestEmail }));

import { runSend } from './send.js';

describe('runSend', () => {
  it('renders and sends selected template', async () => {
    const output = await runSend({ to: 'to@example.com', template: 'welcome' });
    expect(renderPreview).toHaveBeenCalled();
    expect(sendTestEmail).toHaveBeenCalled();
    expect(output).toContain('message-id');
  });
});
