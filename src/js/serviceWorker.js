import { clearCache } from './cache.js'

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../www/service-worker.js').then(
      (registration) => {
        console.info(
          'ServiceWorker registration successful with scope: ',
          registration.scope,
        )
      },
      (err) => {
        console.error('ServiceWorker registration failed: ', err)
      },
    )
  }
}

const handleFetchEvents = () => {
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          // renvoie la réponse en cache si elle existe
          return response
        }
        // sinon, effectue une requête réseau
        return fetch(event.request)
      }),
    )
  })

  self.addEventListener('install', (event) => {
    self.skipWaiting()
  })

  self.addEventListener('activate', (event) => {
    clients.claim()
  })
}

export const setupServicesWorkers = () => {
  if (process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      registerServiceWorker()
      handleFetchEvents()
    })
    setIntervalClearCache()
  }
}

function setIntervalClearCache() {
  setInterval(async () => {
    await clearCache()
  }, 3600000) // 36000
}
