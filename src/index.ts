import fwpr from './fwpr';

/**
 * exports types
 */
export type { FetchWrapperProps } from './lib/create-instance';

/**
 * export lib
 */
export * from './errors/http-request-error';
export * from './lib/error-handling';

export { fwpr as default, fwpr };
