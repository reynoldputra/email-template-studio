/* @vitest-environment jsdom */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App.js';

const fetchMock = vi.fn();

afterEach(() => {
  fetchMock.mockReset();
});

global.fetch = fetchMock as typeof fetch;

describe('App integration', () => {
  it('loads templates and requests preview', async () => {
    fetchMock
      .mockResolvedValueOnce({ json: async () => [{ id: 'welcome', name: 'Welcome' }] })
      .mockResolvedValueOnce({ json: async () => ({ html: '<p>Hello</p>' }) })
      .mockResolvedValueOnce({ json: async () => ({ html: '<p>Hello</p>' }) });

    render(<App />);
    await screen.findByText('Welcome');
    fireEvent.click(screen.getByText('Welcome'));
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/preview', expect.anything());
    });
  });
});
