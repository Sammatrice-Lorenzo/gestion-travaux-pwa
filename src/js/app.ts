import Framework7 from 'framework7/bundle'

import { askUserPermissionForSendANotificationPush } from './notification'

// Import F7 Styles
import 'framework7/css/bundle'

// Import Icons and App Custom Styles
import '../css/icons.css'
import '../css/app.scss'

import App from '../app.f7'
import { checkAndClearCache } from './cache'
import { checkAppVersionOnPageChange } from './helper/routerHelper'
import routes from './routes'
import { setupServicesWorkers } from './serviceWorker'

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

// Session restore on '/' is handled by the async route (see routes.ts)
checkAppVersionOnPageChange(app)

askUserPermissionForSendANotificationPush()
setupServicesWorkers()

export default app
