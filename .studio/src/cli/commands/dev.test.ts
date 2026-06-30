import { describe, expect, it, vi } from 'vitest';
import { runStudioServer } from '../start-studio-server.js';
import { runDev } from './dev.js';

vi.mock('../start-studio-server.js', () => ({
  runStudioServer: vi.fn().mockResolvedValue(undefined)
}));

describe('runDev', () => {
  it('starts bundled studio server', async () => {
    await runDev();
    expect(runStudioServer).toHaveBeenCalledOnce();
  });
});
