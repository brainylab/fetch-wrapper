import { HttpRequestError } from 'src/errors/http-request-error';

import { createPath } from '../utils/create-path';
import { mergeConfigs } from '../utils/merge-configs';
import { objectToUrlParams } from '../utils/object-to-url-params';

import type { FetchWrapperProps } from './create-instance';

export type FwprInterceptors = {
	response: {
		error?: <T>(error: Response, data: T) => Promise<void>;
	};
};

export type FetchWrapperDefaults = {
	headers: HeadersInit & { Authorization?: string };
	interceptors?: FwprInterceptors;
};
type FetchWrapperInit = RequestInit & {
	params?: Record<string, string | number | string[] | number[]>;
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
	private data: any = null;
	private response: Response | null = null;
	public defaults: FetchWrapperDefaults = {
		headers: {},
	};
	public interceptors: FwprInterceptors = {
		response: { error: undefined },
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
		init: FetchWrapperInit,
	): Promise<FetchWrapperResponse<T>> {
		const url = new URL(createPath(path), this.url);

		if (init?.params) {
			const params = objectToUrlParams(init.params);

			url.search = params;
		}

		const configs = init
			? mergeConfigs(this.defaults, init)
			: (this.defaults as RequestInit);

		this.response = await fetch(url, configs);

		if (!this.response.ok) {
			if (
				this.response.headers.get('content-type')?.includes('application/json')
			) {
				this.data = await this.response.json();
			} else {
				this.data = await this.response.text();
			}

			if (this.interceptors.response?.error) {
				await this.interceptors.response.error(this.response, this.data);
			}

			throw new HttpRequestError(this.response as Response, this.data);
		}

		const data = await this.response.json();

		return {
			status: this.response.status,
			statusText: this.response.statusText,
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
