import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Load Intl.DisplayNames polyfill + locale data before any SSR.
    // Ensures server and client render identical country/language names (avoids hydration errors).
    // await import('./utils/intlDisplayNamesInitServer')
    await import('./sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError