
const ERROR_DELETE_CACHE = 'Erreur lors de la suppression du cache "v1":'

export async function responseIsCached(url) {
    const cache = await caches.open('v1')
    const cachedResponse = await cache.match(url)

    return Boolean(cachedResponse)
}

export function stockResponseInCache(url, responseToCache) {
    // Stockage de la réponse en cache
    caches.open('v1').then(function (cache) {
        cache.put(url, responseToCache)
    })
}

export async function checkDataToGetOfAResponseCached(url) {

    let responseInCache = []
    const cache = await caches.open('v1')
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

export function clearCache() {
    caches.delete('v1').then(function (result) {
    }).catch(function (error) {
        console.error(ERROR_DELETE_CACHE, error)
    })
}