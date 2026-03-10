// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require('@sentry/nextjs')
const glob = require('glob')
const { basename } = require('node:path')

const LANG_DIR = './public/static/lang/'
const DEFAULT_LOCALE = 'en'

function getSupportedLanguages() {
  const supportedLanguages = new Set()
  supportedLanguages.add(DEFAULT_LOCALE) // at least 1 supported language
  const files = glob.sync(`${LANG_DIR}/**/*.json`)
  for (const f of files) {
    supportedLanguages.add(basename(f, '.json'))
  }
  return [...supportedLanguages]
}

module.exports = withSentryConfig(
  {
    output: 'standalone',
    env: {
      LOCALES: JSON.stringify(getSupportedLanguages()),
      DEFAULT_LOCALE: DEFAULT_LOCALE,
    },
    async redirects() {
      return [
        {
          source: '/experimental/mat',
          destination: '/chart/mat',
          permanent: true,
        },
      ]
    },
    i18n: {
      locales: getSupportedLanguages(),
      defaultLocale: DEFAULT_LOCALE,
    },
    async headers() {
      const headers = []
      if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
        headers.push({
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex',
            },
          ],
          source: '/:path*',
        })
      }
      return headers
    },
    productionBrowserSourceMaps: true,
  },
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options
    debug: process.env.NODE_ENV === 'development',
    dryRun: process.env.NODE_ENV === 'development',
    release: process.env.GIT_COMMIT_SHA,
    // Suppresses source map uploading logs during build
    silent: true,
    org: 'ooni',
    project: 'explorer',
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
)
