import { fetchCurrentUser, isAuthenticated } from '../token'

export function reloadPage(app, route) {
  app.on('pageBeforeIn', async (page) => {
    const assetVersion = process.env.APP_VERSION
    if (assetVersion && localStorage.getItem('APP_VERSION') !== assetVersion) {
      localStorage.clear()
      localStorage.setItem('APP_VERSION', process.env.APP_VERSION)
      window.location.reload()
    }

    if (page.route.path === '/') {
      await fetchCurrentUser()
    }

    if (page.route.path === '/' && isAuthenticated()) {
      app.views.main.router.navigate(route, {
        animate: false,
      })
    }
  })
}
