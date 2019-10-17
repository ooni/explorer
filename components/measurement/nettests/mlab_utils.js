/* global require */
const MLAB_SERVERS = require('./mlab_servers.json')
import countryUtil from 'country-util'

export const mlabServerDetails = (serverAddress) => {
  const serverNode = serverAddress.split('.')[3]
  const server = MLAB_SERVERS.find((node) => node.site === serverNode)
  if (server) {
    server.countryName = countryUtil.territoryNames[server.country]
  }
  return server || null
}

export const mlabServerToName = (serverAddress) => {
  return serverAddress.split('.').slice(3, 4).join('.')
}
