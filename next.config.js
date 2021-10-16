/* global module */
module.exports = {
  productionBrowserSourceMaps: true,
  webpack: (config, {isServer}) => {
    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }
    return config
  }
}
