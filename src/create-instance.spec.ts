import { create } from './create-instance';
import { FetchWrapper } from './fetch-wrapper';

describe('create-instance', () => {
  it('should create an instance of FetchWrapper', () => {
    const api = create({
      baseUrl: 'http://localhost:3000',
    });

    expect(api).toBeInstanceOf(FetchWrapper);
  });
});
