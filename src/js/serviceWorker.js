import { clearCache } from './cache.js'

export function setupServicesWorkers() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('../www/service-worker.js').then(
        (registration) => {
          // Service worker enregistré avec succès
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope,
          )

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
        },
        (err) => {
          // L'enregistrement du service worker a échoué
          console.log('ServiceWorker registration failed: ', err)
        },
      )
    })

    setIntervalClearCache()
  }
}

function setIntervalClearCache() {
  setInterval(async () => {
    await clearCache()
  }, 3600000) // 36000
  // }, 	60000) // 60 sec
}
