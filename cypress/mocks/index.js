/* global require, process */

// These are used by `msw` to run intercept API calls
// and respond with mock data. This was setup to enable
// visual testing with percy.io

if (typeof window === 'undefined') {
  const { server } = require('./server')
  server.listen()
  /* eslint-disable-next-line no-console */
  console.log(`API_MOCKING: ${process.env.API_MOCKING} - Mocking some API calls in SSR`)
}
