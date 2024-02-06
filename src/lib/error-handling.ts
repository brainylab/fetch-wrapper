import { HttpRequestError } from '../errors/http-request-error';

type FetchTypeError = TypeError & {
  cause?: { code: 'ECONNREFUSED'; address: string; port: number };
};

export type ErrorHandlingResponse = {
  status?: number;
  message: string;
  error: 'HTTP_REQUEST_ERROR' | 'CONNECTION_REFUSED' | 'UNEXPECTED_ERROR';
  throw?: unknown;
};

export function fwprErrorHandling(error: unknown): ErrorHandlingResponse {
  console.log(error);
  if (error instanceof HttpRequestError) {
    return {
      status: error.status,
      message: error.message,
      error: 'HTTP_REQUEST_ERROR',
    };
  }

  if (error instanceof TypeError) {
    const err = error as FetchTypeError;

    if (err?.cause && err?.cause.code === 'ECONNREFUSED') {
      return {
        message: `connection refused ${err.cause.address} on port ${err.cause.port}`,
        error: 'CONNECTION_REFUSED',
      };
    }
  }

  return {
    message: 'an unexpected error occurred',
    error: 'UNEXPECTED_ERROR',
    throw: error,
  };
}
