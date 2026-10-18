import * as Sentry from '@sentry/browser'

// Envoie les erreurs JS non capturées à GlitchTip (compatible SDK Sentry).
// Désactivé si SENTRY_DSN est absent (dev local, tests e2e).
export function setupErrorMonitoring(): void {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    return
  }

  Sentry.init({
    dsn,
    release: process.env.APP_VERSION,
    environment: process.env.NODE_ENV,
    // GlitchTip ne gère que partiellement le tracing : on ne remonte que les erreurs
    tracesSampleRate: 0,
  })
}

// Pour les erreurs attrapées dans un catch : sans cet appel elles ne remontent pas.
// Sans effet si le monitoring n'est pas initialisé.
export function reportError(error: unknown): void {
  Sentry.captureException(error)
}
