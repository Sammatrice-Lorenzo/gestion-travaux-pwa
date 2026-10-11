import { clearCache } from './cache'

function setIntervalClearCache() {
  setInterval(async () => {
    await clearCache()
  }, 3600000)
}

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(
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
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.info(
          'Service Worker Firebase Messaging enregistré',
          registration,
        )
      })
      .catch(console.error)
  }
}

export const setupServicesWorkers = () => {
  if (process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      registerServiceWorker()
    })
    setIntervalClearCache()
  }
}
