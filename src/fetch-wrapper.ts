import { FetchWrapperProps } from './create-instance';
import { HttpRequestError } from './http-error';
import { mergeConfigs } from './utils/merge-configs';

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
  private defaultConfig: RequestInit = {
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
      this.defaultConfig = mergeConfigs(this.defaultConfig, defaultConfig);
    }
  }

  async http<T>(
    path: string,
    init?: RequestInit,
  ): Promise<FetchWrapperResponse<T>> {
    const url = new URL(path, this.url);
    const response = await fetch(url, { ...this.defaultConfig, ...init });

    if (!response.ok) {
      const data = await response.json();
      throw new HttpRequestError(response, data);
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
