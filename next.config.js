/* global module */

// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require('@sentry/nextjs')

const SentryWebpackPluginOptions = {
  // https://github.com/getsentry/sentry-webpack-plugin#options
  debug: process.env.NODE_ENV === 'development',
  dryRun: process.env.NODE_ENV === 'development',
  // release: process.env.GIT_COMMIT_SHA,
  silent: false,
}

module.exports = withSentryConfig({
  productionBrowserSourceMaps: true,
  // disable the webpack plugins for client and server until the
  // release mechanism is clear. At this point, there no need to
  // upload sourcemaps for every single `next build` that happens
  // e.g during E2E testing and vercel preview deployments.
  sentry: {
    disableClientWebpackPlugin: true,
    disableServerWebpackPlugin: true
  }
}, SentryWebpackPluginOptions)
