import { fwpr } from '../index';
import { createInstance } from './create-instance';
import { FetchWrapper } from './fetch-wrapper';

describe('create-instance', () => {
  it('should create an instance of FetchWrapper', () => {
    const api = createInstance({
      baseUrl: 'http://localhost:3000',
    });

    expect(api).toBeInstanceOf(FetchWrapper);
  });

  it('should create an instance of FetchWrapper using index.js', () => {
    const api = fwpr.create({
      baseUrl: 'http://localhost:3000',
    });

    expect(api).toBeInstanceOf(FetchWrapper);
  });
});
