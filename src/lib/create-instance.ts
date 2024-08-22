import { FetchWrapper } from './fetch-wrapper';

import type { FetchWrapperConfig, FwprHooks } from './fetch-wrapper';

export type FetchWrapperProps = {
	baseUrl?: string;
	hooks?: FwprHooks;
	defaultConfig?: FetchWrapperConfig;
};

export function createInstance(defaultConfig?: FetchWrapperProps) {
	const instance = new FetchWrapper(defaultConfig);

	return instance;
}
