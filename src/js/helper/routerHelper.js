import { getToken, isExpired } from '../token'

function checkAuthentication() {
  const isAuthenticated = getToken()
  if (!isAuthenticated) return false

  const tokenIsExpired = isExpired()

  return Boolean(isAuthenticated && !tokenIsExpired)
}

export function reloadPage(app, route) {
  app.on('pageBeforeIn', (page) => {
    const isAuthenticated = checkAuthentication()

    if (page.route.path === '/' && isAuthenticated) {
      app.views.main.router.navigate(route, {
        animate: false,
      })
    }
  })
}
