/* global require, module, process */
const withSourceMaps = require('@zeit/next-source-maps')
const webpack = require('webpack')

process.env.PORT = process.env.PORT || 3100

module.exports = withSourceMaps({
  webpack: (config, {isServer}) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.MEASUREMENTS_URL': JSON.stringify(process.env.MEASUREMENTS_URL || 'https://api.ooni.io'),
        'process.env.EXPLORER_URL': JSON.stringify(process.env.EXPLORER_URL  || 'http://127.0.0.1:' + process.env.PORT),
        'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN || 'https://49af7fff247c445b9a7c98ee21ddfd2f@sentry.io/1427510'),
      })
    )
    config.module.rules.push({
      test: /\.(otf|ttf|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          limit: 10000,
          publicPath: '/_next/static/',
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
})
