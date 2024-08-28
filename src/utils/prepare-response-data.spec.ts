import { describe, it, expect } from 'vitest';

import { prepareResponseData } from './prepare-response-data';

describe('prepareResponseData', () => {
	it('should return JSON data when content-type is application/json', async () => {
		const jsonResponse = new Response(JSON.stringify({ key: 'value' }), {
			headers: { 'Content-Type': 'application/json' },
		});

		const result = await prepareResponseData(jsonResponse);
		expect(result).toEqual({ key: 'value' });
	});

	it('should return text when content-type is not application/json', async () => {
		const textResponse = new Response('plain text', {
			headers: { 'Content-Type': 'text/plain' },
		});

		const result = await prepareResponseData(textResponse);
		expect(result).toBe('plain text');
	});
});
