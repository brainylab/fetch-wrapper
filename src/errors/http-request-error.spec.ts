import { HttpRequestError } from './http-request-error';

describe('http-request-error', () => {
  it('should be http error', () => {
    const mockResponse = {
      status: 404,
      statusText: 'Not Found',
    } as Response;

    const mockDataError = {
      message: 'Resource not found',
    };

    const errorInstance = new HttpRequestError(mockResponse, mockDataError);

    expect(errorInstance.name).toBe('HttpRequestError');
    expect(errorInstance.status).toBe(mockResponse.status);
    expect(errorInstance.message).toBe(mockDataError.message);
  });

  it('should be http error it not message and statusText', () => {
    const mockResponse = {
      status: 404,
    } as Response;

    const errorInstance = new HttpRequestError(mockResponse);

    expect(errorInstance.name).toBe('HttpRequestError');
    expect(errorInstance.status).toBe(mockResponse.status);
  });
});
