type DataRequestErrors = {
  message: string;
};

export class HttpRequestError extends Error {
  status: number;
  message: string;

  constructor(response: Response, data?: DataRequestErrors) {
    const { status, statusText } = response;

    super(statusText || String(status));

    this.name = 'HttpRequestError';
    this.status = status;
    this.message = data?.message || statusText;
  }
}
