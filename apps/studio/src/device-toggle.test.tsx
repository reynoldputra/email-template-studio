/* @vitest-environment jsdom */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PreviewFrame } from './components/preview-frame.js';

describe('PreviewFrame', () => {
  it('applies phone width class', () => {
    render(<PreviewFrame html="<p>Hello</p>" mode="phone" />);
    expect(screen.getByTitle('Template preview').className).toContain('preview-phone');
  });
});
