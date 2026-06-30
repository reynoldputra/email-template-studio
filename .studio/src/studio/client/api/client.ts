export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    return response.json() as Promise<T>;
  },
  post: async <T>(url: string, body: unknown): Promise<T> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    return response.json() as Promise<T>;
  }
};
