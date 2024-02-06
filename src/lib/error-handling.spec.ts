import { HttpRequestError } from '../errors/http-request-error';
import fwpr from '../fwpr';
import { fwprErrorHandling } from './error-handling';

describe('error-handling', () => {
  it('should handle HttpRequestError', async () => {
    const error = fwprErrorHandling(
      new HttpRequestError({
        status: 404,
        statusText: 'Not Found',
      } as Response),
    );

    expect(error).toHaveProperty('error');
    expect(error.error).toEqual('HTTP_REQUEST_ERROR');
  });

  it('should handle ECONNREFUSED error', async () => {
    try {
      await fwpr.get('http://localhost');
    } catch (error) {
      const result = fwprErrorHandling(error);

      expect(result).toHaveProperty('error');
      expect(result.error).toEqual('CONNECTION_REFUSED');
    }
  });

  it('should handle unknown error', () => {
    const error = { code: 'UNKNOWN_ERROR' };
    const result = fwprErrorHandling(error);

    expect(result).toHaveProperty('error');
    expect(result.error).toEqual('UNEXPECTED_ERROR');
  });
});
