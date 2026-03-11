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
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options
  
    org: "ooni",
    project: "explorer",
  
    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,
  
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  
    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,
  
    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",
  
    webpack: {
      // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,
  
      // Tree-shaking options for reducing bundle size
      treeshake: {
        // Automatically tree-shake Sentry logger statements to reduce bundle size
        removeDebugLogging: true,
      },
    },
  },
)
