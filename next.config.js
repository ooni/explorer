/* global module */

// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require('@sentry/nextjs')
const { execSync } = require('child_process')

const SentryWebpackPluginOptions = {
  // https://github.com/getsentry/sentry-webpack-plugin#options
  debug: process.env.NODE_ENV === 'development',
  dryRun: process.env.NODE_ENV === 'development',
  release: process.env.GIT_COMMIT_SHA,
  silent: false,
}

module.exports = withSentryConfig({
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/experimental/mat',
        destination: '/chart/mat',
        permanent: true,
      },
    ]
  },

  webpack: (config, options) => {
    const gitCommitSHAShort = execSync(process.env.RUN_GIT_COMMIT_SHA_SHORT)
    const gitCommitSHA = execSync(process.env.RUN_GIT_COMMIT_SHA)
    const gitCommitRef = execSync(process.env.RUN_GIT_COMMIT_REF)
    const gitCommitTags = execSync(process.env.RUN_GIT_COMMIT_TAGS)

    config.plugins.push(
      new options.webpack.DefinePlugin({
          'process.env.GIT_COMMIT_SHA_SHORT': JSON.stringify(
            gitCommitSHAShort.toString()
          ),
          'process.env.GIT_COMMIT_SHA': JSON.stringify(gitCommitSHA.toString()),
          'process.env.GIT_COMMIT_REF': JSON.stringify(gitCommitRef.toString()),
          'process.env.GIT_COMMIT_TAGS': JSON.stringify(
            gitCommitTags.toString()
          ),
        'process.env.WDYR': JSON.stringify(process.env.WDYR),
      })
    )
    return config
  },
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
