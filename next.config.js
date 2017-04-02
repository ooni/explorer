module.exports = {
  webpack: (config, { dev }) => {
    config.node = {
      'fs': 'empty'
    }
    return config
	}
}
