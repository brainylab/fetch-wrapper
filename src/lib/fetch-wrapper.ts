import { prepareResponseData } from '../utils/prepare-response-data';
import { createPath } from '../utils/create-path';
import { mergeConfigs } from '../utils/merge-configs';
import { objectToUrlParams } from '../utils/object-to-url-params';
import { HttpRequestError } from '../errors/http-request-error';

import type { DataRequestErrors } from '../errors/http-request-error';
import type { ObjectToUrl } from '../utils/object-to-url-params';
import type { FetchWrapperProps } from './create-instance';

export type FetchWrapperConfig = RequestInit & {
	headers?: HeadersInit & { Authorization?: string };
};

type FetchWrapperInit = FetchWrapperConfig & {
	params?: ObjectToUrl;
};

export type FwprHooks = {
	beforeRequest?: (request: Request) => Promise<void>;
	beforeError?: (response: Response, data: unknown) => Promise<void>;
};

type FetchWrapperResponse<T> = {
	status: number;
	statusText: string;
	data: T;
	response: Response;
	request: Request;
};

type FetchMethods = {
	get: <U>(
		path: string | string[],
		init?: FetchWrapperInit,
	) => Promise<FetchWrapperResponse<U>>;
	post: <U = unknown, T = unknown>(
		path: string | string[],
		body?: T,
		init?: FetchWrapperInit,
	) => Promise<FetchWrapperResponse<U>>;
	put: <U = unknown, T = unknown>(
		path: string | string[],
		body: T,
		init?: FetchWrapperInit,
	) => Promise<FetchWrapperResponse<U>>;
	delete: <U>(
		path: string | string[],
		init?: FetchWrapperInit,
	) => Promise<FetchWrapperResponse<U>>;
};

export class FetchWrapper implements FetchMethods {
	private url: string = 'http://localhost';
	private configs: FetchWrapperConfig = {
		headers: {},
	};
	public hooks: FwprHooks = {
		beforeRequest: undefined,
		beforeError: undefined,
	};

	constructor(props?: FetchWrapperProps) {
		if (props?.baseUrl) {
			this.url = props.baseUrl;
		}

		if (props?.defaultConfig) {
			this.configs = mergeConfigs(
				this.configs,
				props.defaultConfig,
			) as FetchWrapperConfig;
		}

		if (props?.hooks) {
			this.hooks = props.hooks;
		}
	}

	protected async http<T>(
		path: string | string[],
		init: FetchWrapperInit,
	): Promise<FetchWrapperResponse<T>> {
		const url = new URL(createPath(path), this.url);

		if (init?.params) {
			const params = objectToUrlParams(init.params);

			url.search = params;
		}

		const configs = init ? mergeConfigs(this.configs, init) : this.configs;

		/**
		 * create a new request instance
		 */
		const request = new globalThis.Request(url, configs);

		/**
		 * implement before hook
		 */
		if (this.hooks?.beforeRequest) {
			await this.hooks.beforeRequest(request);
		}

		const response = await fetch(request);

		if (!response.ok) {
			const data = await prepareResponseData<DataRequestErrors>(response);

			/**
			 * implement beforeError hook
			 */
			if (this.hooks?.beforeError) {
				await this.hooks.beforeError(response, data);
			}

			throw new HttpRequestError(response as Response, data);
		}

		const data = await prepareResponseData(response);

		return {
			status: response.status,
			statusText: response.statusText,
			data: data as T,
			response: response,
			request: request,
		};
	}

	async get<U>(
		path: string | string[],
		init?: FetchWrapperInit,
	): Promise<FetchWrapperResponse<U>> {
		const config = {
			method: 'GET',
			...init,
		} as FetchWrapperInit;

		return await this.http<U>(path, config);
	}

	async post<U = unknown, T = unknown>(
		path: string | string[],
		body?: T,
		init?: FetchWrapperInit,
	): Promise<FetchWrapperResponse<U>> {
		const config = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			...init,
		};

		return await this.http<U>(path, config);
	}

	async put<U = unknown, T = unknown>(
		path: string | string[],
		body: T,
		init?: FetchWrapperInit,
	): Promise<FetchWrapperResponse<U>> {
		const config = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			...init,
		};

		return await this.http<U>(path, config);
	}

	async delete<U>(
		path: string | string[],
		init?: FetchWrapperInit,
	): Promise<FetchWrapperResponse<U>> {
		const config = {
			method: 'DELETE',
			...init,
		} as FetchWrapperInit;

		return await this.http<U>(path, config);
	}
}
