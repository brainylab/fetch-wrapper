import { create } from './create-instance';

const wrapper = { create };

export { wrapper };
export default wrapper;

export * from './http-error';

/**
 * exports types
 */
export type { FetchWrapperProps } from './create-instance';
