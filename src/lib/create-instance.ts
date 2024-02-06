import type { FetchWrapperDefaults } from './fetch-wrapper';
import { FetchWrapper } from './fetch-wrapper';

export type FetchWrapperProps = {
  baseUrl?: string;
  defaultConfig?: FetchWrapperDefaults;
};

export function createInstance(defaultConfig?: FetchWrapperProps) {
  const instance = new FetchWrapper(defaultConfig);

  return instance;
}
