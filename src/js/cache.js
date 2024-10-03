const ERROR_DELETE_CACHE = 'Erreur lors de la suppression du cache "v1":'
const CACHE_V1 = 'v1'
const LAST_CACHE_CLEAR = 'lastCacheClear'

/**
 * @param { URL | String } url 
 * @returns { Promise<boolean> }
 */
async function responseIsCached(url) {
    const cache = await caches.open(CACHE_V1)
    const cachedResponse = await cache.match(url)

    return cachedResponse !== undefined
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
        const dataResponse = cachedData.hasOwnProperty('hydra:member') ? cachedData["hydra:member"] : cachedData
        for (const iterator of dataResponse) {
            responseInCache.push(iterator)
        }
    }

    return responseInCache
}

async function clearCache() {
    await caches.delete(CACHE_V1).then(function () {
    }).catch(function (error) {
        console.error(ERROR_DELETE_CACHE, error)
    })

    localStorage.setItem(LAST_CACHE_CLEAR, Date.now())
}

async function checkAndClearCache() {
    const lastClear = localStorage.getItem(LAST_CACHE_CLEAR)
    const now = Date.now()
    const oneHour = 3600000

    if (!lastClear || (now - lastClear) > oneHour) {
        await clearCache()
    }
}

export { responseIsCached, stockResponseInCache, checkDataToGetOfAResponseCached, clearCache, checkAndClearCache}