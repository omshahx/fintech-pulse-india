interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class TTLCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

// Singleton cache instance
export const cache = new TTLCache();

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  NEWS_FETCH: 15 * 60 * 1000,      // 15 minutes
  SUMMARY: 60 * 60 * 1000,          // 1 hour
  SOURCES: 5 * 60 * 1000,           // 5 minutes
} as const;
