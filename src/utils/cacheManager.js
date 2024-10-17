class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  set(key, value) {
    this.cache.set(key, { value, expireAt: 300000 });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const { value, expireAt } = cached;
    this.cache.delete(key);
    return value;
  }

  delete(key) {
    this.cache.delete(key);
  }
}

const cacheManager = new CacheManager();
export { cacheManager };
