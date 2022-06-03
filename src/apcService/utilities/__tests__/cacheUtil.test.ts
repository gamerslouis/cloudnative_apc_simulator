import { Cache, NodeCacheAdapter } from '../cacheUtil';

const testCache = (cache: Cache) => {
  cache.set('test', 1);
  expect(cache.get('test')).toBe(1);
};

describe('cache utils', () => {
  it('can work with node cache', () => {
    const cache = new NodeCacheAdapter();
    testCache(cache);
  });
});
