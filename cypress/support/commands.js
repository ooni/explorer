/* global Cypress, cy */
import '@percy/cypress'

Cypress.Commands.add('heroHasColor', (color) => {
  cy.get('[data-test-id="hero"]')
    .should('have.css', 'background-color', color)
})
