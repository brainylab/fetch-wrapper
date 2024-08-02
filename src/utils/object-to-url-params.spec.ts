import { describe, it, expect } from 'vitest';

import { objectToUrlParams } from './object-to-url-params';

describe('object-to-url-params', () => {
	it('should be convert object to url params', () => {
		const obj = { a: '1', b: '2', c: '3' };
		const result = objectToUrlParams(obj);

		expect(result).toBe('a=1&b=2&c=3');
	});

	it('should be clear undefined or null object', () => {
		const obj = { a: undefined, b: null, c: '3' };
		const result = objectToUrlParams(obj);

		expect(result).toBe('c=3');
	});

	it('should be convert array to url params', () => {
		const obj = { d: [1, 2, 3, 4] };
		const result = objectToUrlParams(obj);

		expect(result).toBe('d=1&d=2&d=3&d=4');
	});
});
