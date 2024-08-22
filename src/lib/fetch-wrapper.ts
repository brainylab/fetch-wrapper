import { HttpRequestError } from 'src/errors/http-request-error';

import { createPath } from '../utils/create-path';
import { mergeConfigs } from '../utils/merge-configs';
import { objectToUrlParams } from '../utils/object-to-url-params';

import type { ObjectToUrl } from '../utils/object-to-url-params';
import type { FetchWrapperProps } from './create-instance';

export type FetchWrapperConfig = RequestInit & {
	headers?: HeadersInit & { Authorization?: string };
};

type FetchWrapperInit = FetchWrapperConfig & {
	params?: ObjectToUrl;
};

export type FwprHooks = {
	beforeRequest?: (configs: FetchWrapperConfig) => Promise<void>;
	beforeError?: (response: Response, data: any) => Promise<void>;
};

type FetchWrapperResponse<T> = {
	status: number;
	statusText: string;
	data: T;
	raw: {
		response: Response;
		request: FetchWrapperConfig & { url: URL };
	};
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
	private data: any = null;
	private response: Response | null = null;
	public defaults: FetchWrapperConfig = {
		headers: {},
	};
	public hooks: FwprHooks = {
		beforeRequest: undefined,
	};

	constructor(props?: FetchWrapperProps) {
		if (props?.baseUrl) {
			this.url = props.baseUrl;
		}

		if (props?.defaultConfig) {
			this.defaults = mergeConfigs(
				this.defaults,
				props.defaultConfig,
			) as FetchWrapperConfig;
		}

		if (props?.hooks) {
			this.hooks = props.hooks;
		}
	}

	async http<T>(
		path: string | string[],
		init: FetchWrapperInit,
	): Promise<FetchWrapperResponse<T>> {
		const url = new URL(createPath(path), this.url);

		if (init?.params) {
			const params = objectToUrlParams(init.params);

			url.search = params;
		}

		/**
		 * implement before hook
		 */
		if (this.hooks?.beforeRequest) {
			await this.hooks.beforeRequest(this.defaults);
		}

		const configs = init ? mergeConfigs(this.defaults, init) : this.defaults;

		this.response = await fetch(url, configs);

		if (!this.response.ok) {
			if (
				this.response.headers.get('content-type')?.includes('application/json')
			) {
				this.data = await this.response.json();
			} else {
				this.data = await this.response.text();
			}

			/**
			 * implement beforeError hook
			 */
			if (this.hooks?.beforeError) {
				await this.hooks.beforeError(this.response, this.data);
			}

			throw new HttpRequestError(this.response as Response, this.data);
		}

		const data = await this.response.json();

		return {
			status: this.response.status,
			statusText: this.response.statusText,
			data,
			raw: {
				response: this.response,
				request: { url: url, ...configs },
			},
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
			headers: {
				'Content-Type': 'application/json',
			},
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
