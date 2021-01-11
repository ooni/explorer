/* global require */

// These are used by `msw` to run intercept API calls
// and respond with mock data. This was setup to enable
// visual testing with percy.io

if (typeof window === 'undefined') {
  const { server } = require('./server')
  server.listen()
}
