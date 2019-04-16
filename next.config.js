/* global require, module, process */
const withCSS = require('@zeit/next-css')
const withSourceMaps = require('@zeit/next-source-maps')
const child_process = require('child_process')
const webpack = require('webpack')

process.env.PORT = process.env.PORT || 3100

module.exports = withSourceMaps(withCSS({
  generateBuildId: async () => {
    // The latest git commit hash here as buildId
    const gitCommitHash = child_process.execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
    return gitCommitHash
  },
  webpack: (config, {isServer, buildId}) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.MEASUREMENTS_URL': JSON.stringify(process.env.MEASUREMENTS_URL || 'https://api.test.ooni.io'),
        'process.env.EXPLORER_URL': JSON.stringify(process.env.EXPLORER_URL  || 'http://127.0.0.1:' + process.env.PORT),
        'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
        'process.env.SENTRY_RELEASE': JSON.stringify(buildId)
      })
    )
    config.module.rules.push({
      test: /\.(otf|ttf|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          limit: 10000,
          publicPath: './',
          outputPath: 'static/',
          name: '[name].[ext]'
        }
      }
    })

    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    return config
  }
}))
