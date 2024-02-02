import { FetchWrapper, FetchWrapperDefaults } from './fetch-wrapper';

export type FetchWrapperProps = {
  baseUrl?: string;
  defaultConfig?: FetchWrapperDefaults;
};

export function create(defaultConfig: FetchWrapperProps) {
  const instance = new FetchWrapper(defaultConfig);

  return instance;
}
