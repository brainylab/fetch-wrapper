import { HttpRequestError } from '../errors/http-request-error';
import { fwprErrorHandling } from '../lib/error-handling';
import { FetchWrapper } from './fetch-wrapper';

describe('fetch-wrapper', () => {
  let api: FetchWrapper;

  beforeEach(() => {
    api = new FetchWrapper();
  });

  it('should be able to make a GET request', async () => {
    const response = await api.get('https://api.github.com/orgs/brainylab');

    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
    expect(typeof response.data).toBe('object');
    expect(response.data).toHaveProperty('id');
  });

  it('should be able to return an HttpRequestError error on a request', async () => {
    try {
      await api.get('https://api.github.com/orgs');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpRequestError);
    }
  });

  it('should be able to return an HttpRequestError error on a request connection refused', async () => {
    try {
      await api.get('http://localhost');
    } catch (err) {
      const { error } = fwprErrorHandling(err);

      expect(error).toBe('CONNECTION_REFUSED');
    }
  });
});
