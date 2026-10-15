import type Framework7 from 'framework7'
import type { Router } from 'framework7/types'
import { fetchCurrentUser, isAuthenticated } from '../token'

export const AUTHENTICATED_HOME_ROUTE = '/prestation/'

export function checkAppVersionOnPageChange(app: Framework7): void {
  app.on('pageBeforeIn', () => {
    const assetVersion = process.env.APP_VERSION
    if (assetVersion && localStorage.getItem('APP_VERSION') !== assetVersion) {
      localStorage.clear()
      localStorage.setItem('APP_VERSION', assetVersion)
      window.location.reload()
    }
  })
}

/**
 * Async route for '/': resolves the session before rendering anything, so an
 * authenticated user never sees the login page, whatever the mount timing.
 */
export function resolveHomeRoute(
  homeComponent: unknown,
): (ctx: Router.RouteCallbackCtx) => Promise<void> {
  return async ({ router, resolve, reject }) => {
    await fetchCurrentUser()

    if (isAuthenticated()) {
      reject()
      router.navigate(AUTHENTICATED_HOME_ROUTE, {
        animate: false,
        reloadAll: true,
      })
      return
    }

    resolve({ component: homeComponent })
  }
}
