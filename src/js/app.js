import Framework7 from 'framework7/bundle'
import { getToken } from './token'

import { askUserPermissionForSendANotificationPush, messaging } from './notification.js'

// Import F7 Styles
import 'framework7/css/bundle'

// Import Icons and App Custom Styles
import '../css/icons.css'
import '../css/app.scss'

import App from '../app.f7'
import routes from './routes.js'

const app = new Framework7({
    name: 'gestion-travaux-pwa', // App name
    theme: 'auto', // Automatic theme detection
    colors: {
        primary: '#0077B6',
    },

    el: '#app', // App root element
    component: App, // App main component

    // App routes
    routes: routes,
    // Register service worker (only on production build)
    // serviceWorker: process.env.NODE_ENV === 'production' ? {
    //     path: 'service-worker.js',
    // } : {},
})

askUserPermissionForSendANotificationPush()

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('../www/service-worker.js').then(function (registration) {
            // Service worker enregistré avec succès
            console.log('ServiceWorker registration successful with scope: ', registration.scope)

            self.addEventListener('fetch', (event) => {
                event.respondWith(
                    caches.match(event.request)
                        .then((response) => {
                            if (response) {
                                // renvoie la réponse en cache si elle existe
                                return response
                            }
                            // sinon, effectue une requête réseau
                            return fetch(event.request)
                        })
                )
            })
        }, function (err) {
            // L'enregistrement du service worker a échoué
            console.log('ServiceWorker registration failed: ', err)
        })
    })

    clearCache()
}

/**
 * Le cache va se supprimer toute les heures
 */
function clearCache() {
    setInterval(function () {
        caches.delete('v1').then(function (result) {
        }).catch(function (error) {
            console.error('Erreur lors de la suppression du cache "v1":', error)
        })
    }, 3600000) // 36000
    // }, 	60000) // 60 sec
}

function checkAuthentication() {
    const isAuthenticated = getToken()

    return isAuthenticated ? true : false
}

// Écouter l'événement 'pageInit' de Framework7
app.on('pageBeforeIn', function (page) {
    const isAuthenticated = checkAuthentication()

    if (page.route.path === '/' && isAuthenticated) {
        app.views.main.router.navigate('/prestation/', {
            animate: false
        })
    }
})

export default app