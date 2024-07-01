import { FetchWrapper } from './fetch-wrapper';

import type { FetchWrapperDefaults, FwprInterceptors } from './fetch-wrapper';

export type FetchWrapperProps = {
	baseUrl?: string;
	interceptors?: FwprInterceptors;
	defaultConfig?: FetchWrapperDefaults;
};

export function createInstance(defaultConfig?: FetchWrapperProps) {
	const instance = new FetchWrapper(defaultConfig);

	return instance;
}
