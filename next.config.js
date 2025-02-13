/* global module */

// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
const { withSentryConfig } = require('@sentry/nextjs')
const glob = require('glob')
const { dirname, basename, resolve } = require('path')
const { execSync } = require('child_process')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const LANG_DIR = './public/static/lang/'
const DEFAULT_LOCALE = 'en'

function getSupportedLanguages() {
  const supportedLanguages = new Set()
  supportedLanguages.add(DEFAULT_LOCALE) // at least 1 supported language
  glob
    .sync(`${LANG_DIR}/**/*.json`)
    .forEach((f) => supportedLanguages.add(basename(f, '.json')))
  return [...supportedLanguages]
}

module.exports = withBundleAnalyzer(
  withSentryConfig(
    {
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
      webpack: (config, options) => {
        const gitCommitSHAShort = process.env.RUN_GIT_COMMIT_SHA_SHORT
          ? execSync(process.env.RUN_GIT_COMMIT_SHA_SHORT)
          : ''
        const gitCommitSHA = process.env.RUN_GIT_COMMIT_SHA
          ? execSync(process.env.RUN_GIT_COMMIT_SHA)
          : ''
        const gitCommitRef = process.env.RUN_GIT_COMMIT_REF
          ? execSync(process.env.RUN_GIT_COMMIT_REF)
          : ''
        const gitCommitTags = process.env.RUN_GIT_COMMIT_TAGS
          ? execSync(process.env.RUN_GIT_COMMIT_TAGS)
          : ''

        config.plugins.push(
          new options.webpack.DefinePlugin({
            'process.env.GIT_COMMIT_SHA_SHORT': JSON.stringify(
              gitCommitSHAShort.toString(),
            ),
            'process.env.GIT_COMMIT_SHA': JSON.stringify(
              gitCommitSHA.toString(),
            ),
            'process.env.GIT_COMMIT_REF': JSON.stringify(
              gitCommitRef.toString(),
            ),
            'process.env.GIT_COMMIT_TAGS': JSON.stringify(
              gitCommitTags.toString(),
            ),
            'process.env.DEFAULT_LOCALE': DEFAULT_LOCALE,
            'process.env.LOCALES': JSON.stringify(getSupportedLanguages()),
            'process.env.WDYR': JSON.stringify(process.env.WDYR),
          }),
        )

        // SVG
        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = config.module.rules.find((rule) =>
          rule.test?.test?.('.svg'),
        )

        config.module.rules.push(
          // Convert all *.svg imports to React components
          {
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
          },
        )

        // Modify the file loader rule to ignore *.svg, since we have it handled
        fileLoaderRule.exclude = /\.svg$/i

        // whyDidYouRender
        if (options.dev && !options.isServer) {
          const originalEntry = config.entry
          config.entry = async () => {
            const wdrPath = resolve(__dirname, './scripts/wdyr.js')
            const entries = await originalEntry()
            if (entries['main.js'] && !entries['main.js'].includes(wdrPath)) {
              entries['main.js'].unshift(wdrPath)
            }
            return entries
          }
        }

        if (!options.isServer) {
          config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
          }
        }

        return config
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
  ),
)
