export default class LoginCacheService {
  private readonly cacheName = 'v1'

  public async getCachedResponse(url: URL): Promise<Response | null> {
    try {
      const cacheStorage = await caches.open(this.cacheName)
      return (await cacheStorage.match(url)) ?? null
    } catch (error) {
      console.error('Cache error:', error)
      return null
    }
  }

  public async storeInCache(url: URL, response: Response): Promise<void> {
    try {
      const cacheStorage = await caches.open(this.cacheName)
      await cacheStorage.put(url, response)
    } catch (error) {
      console.error('Cache store error:', error)
    }
  }
}
