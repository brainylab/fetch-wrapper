import { HttpRequestError } from '../errors/http-request-error';
import { createPath } from '../utils/create-path';
import { mergeConfigs } from '../utils/merge-configs';
import { objectToUrlParams } from '../utils/object-to-url-params';
import type { FetchWrapperProps } from './create-instance';

export type FetchWrapperDefaults = {
  headers: HeadersInit & { Authorization?: string };
};
type FetchWrapperInit = RequestInit & {
  params?: Record<string, string | number>;
};

type FetchWrapperResponse<T> = {
  status: number;
  statusText: string;
  data: T;
};

type FetchMethods = {
  get: <T>(
    path: string | string[],
    init?: FetchWrapperInit,
  ) => Promise<FetchWrapperResponse<T>>;
  post: <T, U>(
    path: string | string[],
    body?: T,
    init?: FetchWrapperInit,
  ) => Promise<FetchWrapperResponse<U>>;
  put: <T, U>(
    path: string | string[],
    body: T,
    init?: FetchWrapperInit,
  ) => Promise<FetchWrapperResponse<U>>;
  delete: <T>(
    path: string | string[],
    init?: FetchWrapperInit,
  ) => Promise<FetchWrapperResponse<T>>;
};

export class FetchWrapper implements FetchMethods {
  private url: string = 'http://localhost';
  public defaults: FetchWrapperDefaults = {
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json; charset=UTF-8',
    },
  };

  constructor(props?: FetchWrapperProps) {
    if (props?.baseUrl) {
      this.url = props.baseUrl;
    }

    if (props?.defaultConfig) {
      this.defaults = mergeConfigs(
        this.defaults,
        props.defaultConfig,
      ) as FetchWrapperDefaults;
    }
  }

  async http<T>(
    path: string | string[],
    init?: FetchWrapperInit,
  ): Promise<FetchWrapperResponse<T>> {
    const url = new URL(createPath(path), this.url);

    if (init?.params) {
      const params = objectToUrlParams(init.params);

      url.search = params;
    }

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
    path: string | string[],
    init?: FetchWrapperInit,
  ): Promise<FetchWrapperResponse<T>> {
    const config = {
      method: 'GET',
      ...init,
    } as FetchWrapperInit;

    return await this.http<T>(path, config);
  }

  async post<T, U = any>(
    path: string | string[],
    body?: T,
    init?: FetchWrapperInit,
  ): Promise<FetchWrapperResponse<U>> {
    const config = {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    };

    return await this.http<U>(path, config);
  }

  async put<T, U>(
    path: string | string[],
    body: T,
    init?: FetchWrapperInit,
  ): Promise<FetchWrapperResponse<U>> {
    const config = { method: 'PUT', body: JSON.stringify(body), ...init };

    return await this.http<U>(path, config);
  }

  async delete<T>(
    path: string | string[],
    init?: FetchWrapperInit,
  ): Promise<FetchWrapperResponse<T>> {
    const config = {
      method: 'DELETE',
      ...init,
    } as FetchWrapperInit;

    return await this.http<T>(path, config);
  }
}
