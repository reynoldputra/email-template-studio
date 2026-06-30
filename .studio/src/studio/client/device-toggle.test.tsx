/* @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('./hooks/use-template-data.js', () => ({
  useTemplateData: () => ({
    templates: [],
    selectedTemplate: null,
    selectedTemplateId: '',
    selectTemplate: vi.fn(),
    previewHtml: '',
    values: {},
    setVariableValue: vi.fn(),
    sendEmail: vi.fn(),
    status: 'idle' as const,
    errorMessage: ''
  })
}));

import { App } from './App.js';

afterEach(() => cleanup());

describe('Mode segmented control', () => {
  it('defaults to mobile active', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Mobile' }).className).toContain('is-active');
  });

  it('switches to desktop mode on click', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Desktop' }));
    expect(screen.getByRole('button', { name: 'Desktop' }).className).toContain('is-active');
    expect(screen.getByRole('button', { name: 'Mobile' }).className).not.toContain('is-active');
  });
});
