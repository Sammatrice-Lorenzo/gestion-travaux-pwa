import Framework7 from 'framework7/bundle';

// Import F7 Styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.scss';

import store from './store.js';

import App from '../app.f7';
import routes from './routes.js';

const app = new Framework7({
    name: 'gestion-travaux-pwa', // App name
    theme: 'auto', // Automatic theme detection
    colors: {
        primary: '#0077B6',
    },

    el: '#app', // App root element
    component: App, // App main component

    // App store
    store: store,
    // App routes
    routes: routes,
    // Register service worker (only on production build)
    // serviceWorker: process.env.NODE_ENV === 'production' ? {
    //     path: 'service-worker.js',
    // } : {},
});


if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('../www/service-worker.js').then(function (registration) {
            // Service worker enregistré avec succès
            console.log('ServiceWorker registration successful with scope: ', registration.scope);

            self.addEventListener('fetch', (event) => {
                event.respondWith(
                    caches.match(event.request)
                        .then((response) => {
                            if (response) {
                                // renvoie la réponse en cache si elle existe
                                return response;
                            }
                            // sinon, effectue une requête réseau
                            return fetch(event.request);
                        })
                );
            });
        }, function (err) {
            // L'enregistrement du service worker a échoué
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}


export default app;