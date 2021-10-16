/* global module */

// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require('@sentry/nextjs')

const SentryWebpackPluginOptions = {
  // https://github.com/getsentry/sentry-webpack-plugin#options
  silent: true, // Suppresses all logs
}

module.exports = withSentryConfig({
  productionBrowserSourceMaps: true,
}, SentryWebpackPluginOptions)
