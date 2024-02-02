import { createPath } from './create-path';

describe('create-path', () => {
  it('with string', () => {
    const path = 'path/to/resource';
    const result = createPath(path);

    expect(result).toBe('path/to/resource');
  });

  it('with array', () => {
    const path = ['path', 'to', 'resource'];
    const result = createPath(path);

    expect(result).toBe('path/to/resource');
  });
});
