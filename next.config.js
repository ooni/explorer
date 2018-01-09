const webpack = require('webpack')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.MEASUREMENTS_URL': JSON.stringify(process.env.MEASUREMENTS_URL)
      })
    )
    return config
  }
}
