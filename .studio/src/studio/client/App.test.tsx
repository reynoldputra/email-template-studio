/* @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react';
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

describe('App', () => {
  it('renders studio heading', () => {
    render(<App />);
    expect(screen.getByText('Email Template Studio')).toBeTruthy();
  });

  it('renders sidebar toggle and segmented control', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Sidebar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Mobile' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Desktop' })).toBeTruthy();
  });
});
