import NodeCache, { Key } from 'node-cache';

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
