/* global require, module */
const withSourceMaps = require('@zeit/next-source-maps')

module.exports = withSourceMaps({
  webpack: (config, {isServer}) => {
    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }
    return config
  }
})
