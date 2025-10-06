const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const request = async <T>(path: string, method: HttpMethod, body?: unknown, token?: string | null): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Сервер қатесі');
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
};

export const api = {
  get: <T>(path: string, token?: string | null) => request<T>(path, 'GET', undefined, token),
  post: <T>(path: string, body: unknown, token?: string | null) => request<T>(path, 'POST', body, token),
  put: <T>(path: string, body: unknown, token?: string | null) => request<T>(path, 'PUT', body, token),
  delete: <T>(path: string, token?: string | null) => request<T>(path, 'DELETE', undefined, token),
};
