const ERROR_DELETE_CACHE = 'Erreur lors de la suppression du cache "v1":'
const CACHE_V1 = 'v1'

async function responseIsCached(url) {
    const cache = await caches.open(CACHE_V1)
    const cachedResponse = await cache.match(url)

    return Boolean(cachedResponse)
}

function stockResponseInCache(url, responseToCache) {
    // Stockage de la réponse en cache
    caches.open(CACHE_V1).then(function (cache) {
        cache.put(url, responseToCache)
    })
}

async function checkDataToGetOfAResponseCached(url) {

    let responseInCache = []
    const cache = await caches.open(CACHE_V1)
    const cachedResponse = await cache.match(url)

    if (cachedResponse) {
        // Utilisation de la réponse en cache
        const cachedData = await cachedResponse.json()
        for (const iterator of cachedData['hydra:member']) {
            responseInCache.push(iterator)
        }
    }

    return responseInCache
}

function clearCache() {
    caches.delete(CACHE_V1).then(function (result) {
    }).catch(function (error) {
        console.error(ERROR_DELETE_CACHE, error)
    })

    localStorage.setItem('lastCacheClear', Date.now())
}

function checkAndClearCache() {
    const lastClear = localStorage.getItem('lastCacheClear')
    const now = Date.now()
    const oneHour = 3600000

    if (!lastClear || (now - lastClear) > oneHour) {
        clearCache()
    }
}

export { responseIsCached, stockResponseInCache, checkDataToGetOfAResponseCached, clearCache, checkAndClearCache}