// import { setupWorker} from 'msw'
// import { handlers } from '/cypress/mocks/handlers'

// let worker

// before(() => {
//   worker = setupWorker(...handlers)
//   cy.wrap(worker.start({ onUnhandledRequest: 'bypass' }))
// })
// Cypress.on('test:before:run', () => {
//   if (!worker) return
//   worker.resetHandlers()
// })

// Cypress.Commands.add('interceptRequest', (...params) => {
//   worker.use(...params)
// })
