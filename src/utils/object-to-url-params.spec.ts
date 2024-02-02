import { test } from 'vitest';

import { objectToUrlParams } from './object-to-url-params';

test('object-to-url-params', () => {
  const obj = { a: '1', b: '2', c: '3' };
  const result = objectToUrlParams(obj);

  expect(result).toBe('a=1&b=2&c=3');
});
