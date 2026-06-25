/* @vitest-environment jsdom */

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./hooks/use-template-data.js', () => ({
  useTemplateData: () => ({
    templates: [],
    selectedTemplateId: '',
    setSelectedTemplateId: vi.fn(),
    previewHtml: '',
    values: {},
    setValues: vi.fn(),
    sendEmail: vi.fn(),
    sendResult: '',
    error: ''
  })
}));

import { App } from './App.js';

describe('App', () => {
  it('renders studio heading', () => {
    render(<App />);
    expect(screen.getByText('Email Template Studio')).toBeTruthy();
  });
});
