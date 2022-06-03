import { Cache, MongoDBCacheAdapter, NodeCacheAdapter } from '../cacheUtil';
import { MongoMemoryServer } from 'mongodb-memory-server';

const testCache = async (cache: Cache) => {
  await cache.set('test', 1);
  expect(await cache.get('test')).toBe(1);
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

  it('can work with node cache',async () => {
    const nodeCache = new NodeCacheAdapter();
    await testCache(nodeCache);
    const mongoCache = new MongoDBCacheAdapter(mongod.getUri(), 'testCollect');
    await testCache(mongoCache);
  });
});
