/* global require */
const MLAB_SERVERS = require('./mlab_servers.json')

export const mlabServerToCountry = (serverAddress) => {
  return MLAB_SERVERS[serverAddress.split('.')[3]] || 'ZZ'
}

export const mlabServerToName = (serverAddress) => {
  return serverAddress.split('.').slice(3, 4).join('.')
}
