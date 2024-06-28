import { test } from 'vitest';

import { objectToUrlParams } from './object-to-url-params';

test('object-to-url-params', () => {
	const obj = { a: '1', b: '2', c: '3' };
	const result = objectToUrlParams(obj);

	expect(result).toBe('a=1&b=2&c=3');
});

test('array-to-url-params', () => {
	const obj = { d: [1, 2, 3, 4] };
	const result = objectToUrlParams(obj);

	expect(result).toBe('d[0]=1&d[1]=2&d[2]=3&d[3]=4');
});
