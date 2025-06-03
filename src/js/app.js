import Framework7 from 'framework7/bundle'

import {
  askUserPermissionForSendANotificationPush,
  messaging,
} from './notification.js'

// Import F7 Styles
import 'framework7/css/bundle'

// Import Icons and App Custom Styles
import '../css/icons.css'
import '../css/app.scss'

import App from '../app.f7'
import { checkAndClearCache } from './cache.js'
import { reloadPage } from './helper/routerHelper.js'
import routes from './routes.js'
import { setupServicesWorkers } from './serviceWorker.js'

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

askUserPermissionForSendANotificationPush()
setupServicesWorkers()
reloadPage(app, '/prestation/')
;async () => {
  await checkAndClearCache()
}

export default app
