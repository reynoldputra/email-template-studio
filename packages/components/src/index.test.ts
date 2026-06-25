import { describe, expect, it } from 'vitest';
import { componentFiles } from './index.js';

describe('componentFiles', () => {
  it('exposes starter component file names', () => {
    expect(componentFiles).toEqual(['button.mjml', 'footer.mjml', 'header.mjml', 'section.mjml', 'spacer.mjml']);
  });
});
