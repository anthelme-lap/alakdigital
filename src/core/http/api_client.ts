import { NetworkError, parseApiError } from './http_error';

interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export class ApiClient {
  constructor(private readonly baseUrl: string = '/api') {}

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: options?.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => undefined);
        throw parseApiError(response.status, errorData?.message);
      }

      if (response.status === 204) return undefined as T;
      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof NetworkError) throw error;
      if (error instanceof TypeError) throw new NetworkError();
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
