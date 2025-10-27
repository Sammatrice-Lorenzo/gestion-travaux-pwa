const ERROR_DELETE_CACHE = 'Erreur lors de la suppression du cache "v1":'
const CACHE_V1 = 'v1'
const LAST_CACHE_CLEAR = 'lastCacheClear'

async function responseIsCached(url: URL | string): Promise<boolean> {
  const cache = await caches.open(CACHE_V1)
  const cachedResponse = await cache.match(url)
  return cachedResponse !== undefined
}

async function stockResponseInCache(
  url: URL | string,
  responseToCache: Response,
): Promise<void> {
  const cache = await caches.open(CACHE_V1)
  await cache.put(url, responseToCache)
}

async function checkDataToGetOfAResponseCached<T = unknown>(
  url: URL | string,
): Promise<T | never[]> {
  const responseInCache: never[] = []
  const cache = await caches.open(CACHE_V1)
  const cachedResponse = await cache.match(url)

  if (cachedResponse) {
    return await cachedResponse.json()
  }

  return responseInCache
}

async function clearCache(): Promise<void> {
  try {
    await caches.delete(CACHE_V1)
  } catch (error) {
    console.error(ERROR_DELETE_CACHE, error)
  }

  localStorage.setItem(LAST_CACHE_CLEAR, Date.now().toString())
}

async function checkAndClearCache(durationMs = 3_600_000): Promise<void> {
  const lastClear = localStorage.getItem(LAST_CACHE_CLEAR)
  const now = Date.now()

  if (!lastClear || now - Number(lastClear) > durationMs) {
    await clearCache()
  }
}

export {
  responseIsCached,
  stockResponseInCache,
  checkDataToGetOfAResponseCached,
  clearCache,
  checkAndClearCache,
}
