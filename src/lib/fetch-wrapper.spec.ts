import { HttpRequestError } from 'src/errors/http-request-error';

import { fwprErrorHandling } from '../lib/error-handling';

import { FetchWrapper } from './fetch-wrapper';

describe('fetch-wrapper', () => {
	let api: FetchWrapper;

	beforeEach(() => {
		api = new FetchWrapper();
	});

	it('should be able to make a GET request', async () => {
		const response = await api.get(
			'https://brasilapi.com.br/api/cep/v2/89010025',
		);

		expect(response.status).toBe(200);
		expect(response.statusText).toBe('OK');
		expect(typeof response.data).toBe('object');
		expect(response.data).toHaveProperty('cep');
	});

	it('should be able to return an HttpRequestError error on a request', async () => {
		try {
			await api.get('https://brasilapi.com.br/api/cep/v2');
		} catch (err) {
			expect(err).toBeInstanceOf(HttpRequestError);
		}
	});

	it('should be able to using hook before request', async () => {
		const apiInstance = new FetchWrapper({
			baseUrl: 'https://brasilapi.com.br/',
			hooks: {
				beforeRequest: async (request) => {
					request.headers.set('x-custom-header', 'custom-value');
				},
			},
		});

		const response = await apiInstance.get('/api/cep/v2/89010025');

		expect(response.request.headers.get('x-custom-header')).toEqual(
			'custom-value',
		);
	});

	it('should be able to intercept an HttpRequestError error on a request', async () => {
		api.hooks.beforeError = async () => {
			throw new Error('intercept error');
		};

		try {
			await api.get('https://api.github.com/orgs');
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
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
