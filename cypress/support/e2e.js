// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
// import { worker, rest } from '../mocks/browser'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err, runnable) => {
  // we expect a 3rd party library error with message 'ResizeObserver loop limit exceeded'
  // and don't want to fail the test so we return false
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  // we still want to ensure there are no other unexpected
  // errors, so we let them fail the test
})

// Make the `worker` and `rest` references available globally,
// so they can be accessed in both runtime and test suites.
Cypress.on('test:before:run', () => {
  //  if(window.msw) {
  //     console.log('MSW is already running.')
  //  }

  //  //if MSW wasnt started by the app, Cypress needs to start it
  //  if(!window.msw){ 
  //   window.msw = {
  //     worker,
  //     rest,
  //   }

  //     console.log('MSW has not been started. Starting now.')
  //     worker.start({
  //       // This is going to perform unhandled requests
  //       // but print no warning whatsoever when they happen.
  //       onUnhandledRequest: 'bypass'
  //     })
  //  }
})
