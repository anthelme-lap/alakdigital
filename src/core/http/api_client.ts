import { tokenStore } from '@/core/auth/token_store';
import { UnauthorizedError } from '@/core/errors/app_error';
import { NetworkError, parseApiError } from './http_error';

interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Interne : evite de boucler indefiniment sur /auth/refresh. */
  skipAuthRetry?: boolean;
}

interface RefreshResponse {
  token: string;
  refresh_token: string;
}

const DEFAULT_API_BASE = 'http://localhost:8000/api/v1';

export class ApiClient {
  private refreshPromise: Promise<boolean> | null = null;

  constructor(
    private readonly baseUrl: string = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ??
      DEFAULT_API_BASE,
  ) {}

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  /** Upload multipart (FormData) — pas de Content-Type manuel (le navigateur pose le boundary). */
  async upload<T>(path: string, formData: FormData, options?: RequestOptions, method: 'POST' | 'PUT' = 'POST'): Promise<T> {
    return this.request<T>(method, path, formData, options, true);
  }

  /**
   * Upload multipart avec suivi de progression (0-100). `fetch` n'expose pas
   * la progression d'un envoi, on passe donc par XMLHttpRequest pour cet
   * unique cas d'usage.
   */
  uploadWithProgress<T>(
    path: string,
    formData: FormData,
    onProgress: (percent: number) => void,
    options?: RequestOptions,
    method: 'POST' | 'PUT' = 'POST',
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${path}`;
      const accessToken = tokenStore.getAccessToken();
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      if (accessToken) xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      Object.entries(options?.headers ?? {}).forEach(([key, value]) => xhr.setRequestHeader(key, value));

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (xhr.status === 204 || !xhr.responseText) {
            resolve(undefined as T);
            return;
          }
          try {
            resolve(JSON.parse(xhr.responseText) as T);
          } catch {
            resolve(undefined as T);
          }
          return;
        }
        let message: string | undefined;
        try {
          message = JSON.parse(xhr.responseText)?.message;
        } catch {
          // reponse non JSON
        }
        reject(parseApiError(xhr.status, message));
      };

      xhr.onerror = () => reject(new NetworkError());
      xhr.onabort = () => reject(new NetworkError('Televersement annule.'));

      options?.signal?.addEventListener('abort', () => xhr.abort());

      xhr.send(formData);
    });
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
    isMultipart = false,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const accessToken = tokenStore.getAccessToken();
    const headers: Record<string, string> = {
      ...(isMultipart ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options?.headers,
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : isMultipart ? (body as FormData) : JSON.stringify(body),
        signal: options?.signal,
      });

      if (!response.ok) {
        if (response.status === 401 && !options?.skipAuthRetry && path !== '/auth/refresh') {
          const refreshed = await this.tryRefresh();
          if (refreshed) {
            return this.request<T>(method, path, body, { ...options, skipAuthRetry: true }, isMultipart);
          }
        }
        const errorData = await response.json().catch(() => undefined);
        throw parseApiError(response.status, errorData?.message);
      }

      if (response.status === 204) return undefined as T;
      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof NetworkError || error instanceof UnauthorizedError) throw error;
      if (error instanceof TypeError) throw new NetworkError();
      throw error;
    }
  }

  /** Rafraichit une seule fois par vague de requetes 401 simultanees. */
  private async tryRefresh(): Promise<boolean> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.doRefresh().finally(() => {
        this.refreshPromise = null;
      });
    }
    return this.refreshPromise;
  }

  private async doRefresh(): Promise<boolean> {
    const refreshToken = tokenStore.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const data = await this.request<RefreshResponse>(
        'POST',
        '/auth/refresh',
        { refresh_token: refreshToken },
        { skipAuthRetry: true },
      );
      tokenStore.setTokens(data.token, data.refresh_token);
      return true;
    } catch {
      tokenStore.clear();
      return false;
    }
  }
}

export const apiClient = new ApiClient();
