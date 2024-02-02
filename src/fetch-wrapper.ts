import { FetchWrapperProps } from './create-instance';
import { HttpRequestError } from './http-error';
import { mergeConfigs } from './utils/merge-configs';

export type FetchWrapperDefaults = {
  headers: HeadersInit & { Authorization?: string };
};

type FetchWrapperResponse<T> = {
  status: number;
  statusText: string;
  data: T;
};

interface FetchMethods {
  get: <T>(
    path: string,
    init?: RequestInit,
  ) => Promise<FetchWrapperResponse<T>>;
  post: <T, U>(
    path: string,
    body?: T,
    init?: RequestInit,
  ) => Promise<FetchWrapperResponse<U>>;
  put: <T, U>(
    path: string,
    body: T,
    init?: RequestInit,
  ) => Promise<FetchWrapperResponse<U>>;
  delete: <T>(
    path: string,
    init?: RequestInit,
  ) => Promise<FetchWrapperResponse<T>>;
}

export class FetchWrapper implements FetchMethods {
  private url: string;
  public defaults: FetchWrapperDefaults = {
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json; charset=UTF-8',
    },
  };

  constructor({
    baseUrl = 'http://localhost',
    defaultConfig,
  }: FetchWrapperProps) {
    this.url = baseUrl;

    if (defaultConfig) {
      this.defaults = mergeConfigs(
        this.defaults,
        defaultConfig,
      ) as FetchWrapperDefaults;
    }
  }

  async http<T>(
    path: string,
    init?: RequestInit,
  ): Promise<FetchWrapperResponse<T>> {
    const url = new URL(path, this.url);

    const response = await fetch(
      url,
      init ? mergeConfigs(this.defaults, init) : this.defaults,
    );

    if (!response.ok) {
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        throw new HttpRequestError(response, data);
      } else {
        const data = await response.text();

        throw new HttpRequestError(response, {
          message: data,
        });
      }
    }

    const data = await response.json();

    return {
      status: response.status,
      statusText: response.statusText,
      data,
    };
  }

  async get<T>(
    path: string,
    init?: RequestInit,
  ): Promise<FetchWrapperResponse<T>> {
    const config = {
      method: 'GET',
      ...init,
    } as RequestInit;

    return await this.http<T>(path, config);
  }

  async post<T, U = any>(
    path: string,
    body?: T,
    init?: RequestInit,
  ): Promise<FetchWrapperResponse<U>> {
    const config = {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    };

    return await this.http<U>(path, config);
  }

  async put<T, U>(
    path: string,
    body: T,
    init?: RequestInit,
  ): Promise<FetchWrapperResponse<U>> {
    const config = { method: 'PUT', body: JSON.stringify(body), ...init };

    return await this.http<U>(path, config);
  }

  async delete<T>(
    path: string,
    init?: RequestInit,
  ): Promise<FetchWrapperResponse<T>> {
    const config = {
      method: 'DELETE',
      ...init,
    } as RequestInit;

    return await this.http<T>(path, config);
  }
}
