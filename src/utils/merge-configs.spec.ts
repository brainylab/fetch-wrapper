import { test, expect } from 'vitest';

import { mergeConfigs } from './merge-configs';

test('merge-configs', () => {
  const defaultConfig = { a: 1, b: 2 };
  const newConfig = { b: 3, c: 4 };
  const result = mergeConfigs(defaultConfig, newConfig);

  expect(result).toEqual({ a: 1, b: 3, c: 4 });
});
