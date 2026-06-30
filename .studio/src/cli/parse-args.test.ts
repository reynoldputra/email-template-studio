import { describe, expect, it } from 'vitest';
import { parseArgs } from './parse-args.js';

describe('parseArgs', () => {
  it('parses dev, build, and validate commands', () => {
    expect(parseArgs(['dev']).command).toBe('dev');
    expect(parseArgs(['build']).command).toBe('build');
    expect(parseArgs(['validate']).command).toBe('validate');
  });

  it('falls back to dev for unknown command', () => {
    expect(parseArgs(['wat']).command).toBe('dev');
  });
});
