import { FetchWrapper } from './fetch-wrapper';

export type FetchWrapperProps = {
  baseUrl?: string;
  defaultConfig?: RequestInit;
};

export function create(defaultConfig: FetchWrapperProps) {
  const instance = new FetchWrapper(defaultConfig);

  return instance;
}
