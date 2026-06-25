import { describe, expect, it } from 'vitest';
import { parseArgs } from './parse-args.js';

describe('parseArgs', () => {
  it('parses build command', () => {
    expect(parseArgs(['build'])).toEqual({ command: 'build', flags: {} });
  });

  it('parses send flags', () => {
    expect(parseArgs(['send', '--to', 'x@example.com', '--template', 'welcome'])).toEqual({
      command: 'send',
      flags: { to: 'x@example.com', template: 'welcome' }
    });
  });
});
