import { mergeConfigs } from './merge-configs';

describe('merge-configs', () => {
  it('should merge two objects', () => {
    const defaultConfig = { a: 1, b: 2 };
    const newConfig = { b: 3, c: 4 };
    const result = mergeConfigs(defaultConfig, newConfig);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should merge nested object', () => {
    const defaultConfig = { a: 1, b: 2, c: { a: 5 } };
    const newConfig = { b: 3, c: { b: 5 } };
    const result = mergeConfigs(defaultConfig, newConfig);

    expect(result).toEqual({
      a: 1,
      b: 3,
      c: {
        a: 5,
        b: 5,
      },
    });
  });
});
