/* @vitest-environment jsdom */

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App.js';

const fetchMock = vi.fn();
global.fetch = fetchMock as typeof fetch;

afterEach(() => {
  cleanup();
  fetchMock.mockReset();
});

describe('App integration', () => {
  it('loads templates and requests preview', async () => {
    const templates = [
      {
        id: 'welcome',
        name: 'Welcome',
        preview: 'Welcome aboard',
        tokens: [
          { expression: 'first_name', key: 'first_name', label: 'First Name', defaultValue: 'Ava', inputType: 'text' }
        ]
      }
    ];

    fetchMock
      .mockResolvedValueOnce({ json: async () => templates })
      .mockResolvedValueOnce({ json: async () => ({ html: '<p>Hello</p>' }) });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Welcome' })).toBeTruthy();
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/preview', expect.anything());
    });
  });
});
