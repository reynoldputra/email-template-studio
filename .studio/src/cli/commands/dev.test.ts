import { describe, expect, it, vi } from 'vitest';
import { createServer } from 'vite';
import { createStudioServer } from '../../studio/server/dev-server.js';
import { runDev } from './dev.js';

vi.mock('../../studio/server/dev-server.js', () => ({
  createStudioServer: vi.fn().mockReturnValue({
    listen: (_port: number, _host: string, cb: () => void) => cb()
  })
}));

vi.mock('vite', () => ({
  createServer: vi.fn().mockResolvedValue({
    listen: vi.fn().mockResolvedValue(undefined),
    printUrls: vi.fn()
  })
}));

describe('runDev', () => {
  it('starts the API server and the Vite dev server', async () => {
    await runDev();
    expect(createStudioServer).toHaveBeenCalledOnce();
    expect(createServer).toHaveBeenCalledOnce();
  });
});
