import Framework7 from 'framework7/bundle'

import { askUserPermissionForSendANotificationPush } from './notification.ts'

// Import F7 Styles
import 'framework7/css/bundle'

// Import Icons and App Custom Styles
import '../css/icons.css'
import '../css/app.scss'

import App from '../app.f7'
import { checkAndClearCache } from './cache.ts'
import { reloadPage } from './helper/routerHelper.ts'
import routes from './routes.ts'
import { setupServicesWorkers } from './serviceWorker.ts'

const app = new Framework7({
  name: 'Gestion Travaux',
  theme: 'auto',
  colors: {
    primary: '#0D2847',
    secondary: '#004074',
    accent: '#2870BD',
    background: '#0D1520',
    surface: '#111927',
    text: '#C2E6FF',
    muted: '#205D9E',
    border: '#205D9E',
  },

  el: '#app',
  component: App,
  routes: routes,
  // Register service worker (only on production build)
  // serviceWorker: process.env.NODE_ENV === 'production' ? {
  //     path: 'service-worker.js',
  // } : {},
})

// Registered synchronously right after app creation, before any await, so it
// is guaranteed to catch the initial 'pageBeforeIn' fired for the '/' route
// (page components mount asynchronously) instead of racing a network call.
reloadPage(app, '/prestation/')

askUserPermissionForSendANotificationPush()
setupServicesWorkers()

export default app
