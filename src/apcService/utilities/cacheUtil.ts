import NodeCache, { Key } from 'node-cache';
import sp from 'synchronized-promise';
const { mongodb } = require('config');
const cacheManager = require('cache-manager');
const mongoStore = require('cache-manager-mongodb');

export interface Cache {
  get(key: String): number;
  set(key: String, value: number);
  close();
}

export class MongoCache implements Cache {
  public get(key: String): number {
    return;
  }

  public set(key: String, value: number): Boolean {
    return;
  }

  public close() {}
}

export class NodeCacheAdapter implements Cache {
  cache: NodeCache;

  constructor() {
    this.cache = new NodeCache();
  }
  public get(key: String): number {
    return this.cache.get(key as Key);
  }
  public set(key: String, value: number): Boolean {
    return this.cache.set(key as Key, value);
  }
  public close() {
    this.cache.close();
  }
}

export class MongoDBCacheAdapter implements Cache {
  ttl: number = 60;
  mongoCache: any;

  constructor() {
    this.mongoCache = cacheManager.caching({
      store: mongoStore,
      uri: mongodb.uri,
      options: {
        collection: mongodb.collection,
        compression: false,
        poolSize: 10,
        autoReconnect: true,
      },
    });
  }

  get(key: String): number {
    return sp(this.mongoCache.get)(key) as number;
  }

  set(key: String, value: number) {
    sp(this.mongoCache.set)(key, value, this.ttl);
  }

  close() {
    this.mongoCache = undefined;
  }
}
