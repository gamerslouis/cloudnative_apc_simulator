import NodeCache, { Key } from 'node-cache';
import sp from 'synchronized-promise';
const cacheManager = require('cache-manager');
const mongoStore = require('cache-manager-mongodb');

export interface Cache {
  get(key: String): Promise<number>;
  set(key: String, value: number): Promise<boolean>;
  close();
}

export class NodeCacheAdapter implements Cache {
  cache: NodeCache;

  constructor() {
    this.cache = new NodeCache();
  }
  public async get(key: String) {
    return this.cache.get(key as Key) as number;
  }
  public async set(key: String, value: number) {
    return this.cache.set(key as Key, value);
  }
  public close() {
    this.cache.close();
  }
}

export class MongoDBCacheAdapter implements Cache {
  ttl: number = 60;
  mongoCache: any;

  constructor(
    uri: string,
    collection,
    options: {
      enableAuth?: boolean;
      username?: string;
      password?: string;
    } = {},
  ) {
    let full_uri;
    if (options?.enableAuth) {
      full_uri = `mongodb://${options.username}:${
        options.password
      }@${uri.substring(10)}`;
    } else {
      full_uri = uri;
    }
    this.mongoCache = cacheManager.caching({
      store: mongoStore,
      uri: full_uri,
      options: {
        collection: collection,
        compression: false,
        poolSize: 10,
        autoReconnect: true,
      },
    });
  }

  async get(key: String) {
    return await this.mongoCache.get(key);
  }

  async set(key: String, value: number) {
    try {
      await this.mongoCache.set(key, value, this.ttl);
      return true;
    } catch (e) {
      return false;
    }
  }

  close() {
    this.mongoCache = undefined;
  }
}
