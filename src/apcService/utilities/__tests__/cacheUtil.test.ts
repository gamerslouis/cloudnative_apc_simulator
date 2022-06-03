import { Cache, MongoDBCacheAdapter, NodeCacheAdapter } from '../cacheUtil';
import { MongoMemoryServer } from 'mongodb-memory-server';

const testCache = (cache: Cache) => {
  cache.set('test', 1);
  expect(cache.get('test')).toBe(1);
  cache.close();
};

describe('cache utils', () => {
  let mongod;
  beforeAll(async () => {
    mongod = new MongoMemoryServer();
    await mongod.start();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  it('can work with node cache', () => {
    const nodeCache = new NodeCacheAdapter();
    testCache(nodeCache);
    const mongoCache = new MongoDBCacheAdapter(mongod.getUri(), 'testCollect');
    testCache(mongoCache);
  });
});
