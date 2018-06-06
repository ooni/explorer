/* global require, module, process */
const withCSS = require('@zeit/next-css')
const withSourceMaps = require('@zeit/next-source-maps')

const webpack = require('webpack')

module.exports = withSourceMaps(withCSS({
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.MEASUREMENTS_URL': JSON.stringify(process.env.MEASUREMENTS_URL || 'https://api.ooni.io')
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
    return config
  }
}))
