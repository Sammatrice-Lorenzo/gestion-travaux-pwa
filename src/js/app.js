import Framework7 from 'framework7/bundle'

import { askUserPermissionForSendANotificationPush, messaging } from './notification.js'

// Import F7 Styles
import 'framework7/css/bundle'

// Import Icons and App Custom Styles
import '../css/icons.css'
import '../css/app.scss'

import App from '../app.f7'
import routes from './routes.js'
import { reloadPage } from './helper/routerHelper.js'
import { setupServicesWorkers } from './serviceWorker.js'

const app = new Framework7({
    name: 'Gestion Travaux', // App name
    theme: 'auto', // Automatic theme detection
    colors: {
        primary: '#0077B6',
    },

    el: '#app', // App root element
    component: App, // App main component

    // App routes
    routes: routes
    // Register service worker (only on production build)
    // serviceWorker: process.env.NODE_ENV === 'production' ? {
    //     path: 'service-worker.js',
    // } : {},
})

askUserPermissionForSendANotificationPush()
setupServicesWorkers()

reloadPage(app, '/prestation/')

export default app