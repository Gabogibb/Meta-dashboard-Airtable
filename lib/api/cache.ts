// Simple in-memory cache implementation
// In production, use Vercel KV or Redis

interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
}

const cache = new Map<string, CacheEntry>()

export function getCachedData(key: string): any | null {
  const entry = cache.get(key)
  if (!entry) return null

  const now = Date.now()
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key)
    return null
  }

  return entry.data
}

export function setCachedData(key: string, data: any, ttlMs: number = 30 * 60 * 1000) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  })
}

export function clearCache(pattern?: string) {
  if (!pattern) {
    cache.clear()
    return
  }

  const regex = new RegExp(pattern)
  const keysToDelete: string[] = []
  cache.forEach((_, key) => {
    if (regex.test(key)) {
      keysToDelete.push(key)
    }
  })
  keysToDelete.forEach((key) => cache.delete(key))
}

export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  }
}
