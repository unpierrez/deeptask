export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  token?: string;
}

type TokenRefresher = () => Promise<string | null>;
let tokenRefresher: TokenRefresher | null = null;

export function setTokenRefresher(fn: TokenRefresher) {
  tokenRefresher = fn;
}

async function request<T>(
  path: string,
  options: ApiRequestOptions = {},
  _retry = false,
): Promise<T> {
  const { method = 'GET', body, token } = options;
  const headers = new Headers({ 'Content-Type': 'application/json' });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}/${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && !_retry && tokenRefresher) {
    const newToken = await tokenRefresher();
    if (newToken) {
      return request<T>(path, { ...options, token: newToken }, true);
    }
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText;
    throw new Error(
      typeof message === 'string' ? message : 'Erro na requisição',
    );
  }

  return data;
}

export function apiGet<T>(path: string, token?: string) {
  return request<T>(path, { method: 'GET', token });
}

export function apiPost<T>(path: string, body?: unknown, token?: string) {
  return request<T>(path, { method: 'POST', body, token });
}

export function apiPatch<T>(path: string, body?: unknown, token?: string) {
  return request<T>(path, { method: 'PATCH', body, token });
}

export function apiDelete<T>(path: string, token?: string) {
  return request<T>(path, { method: 'DELETE', token });
}
