/* global describe, it, cy, before */

describe('Home Page Tests', () => {

  before(() => {
    cy.intercept('GET', '/api/_/*').as('apiCalls')
    cy.visit('/')
  })

  // TODO: Check if stats appear
  // TODO: Check if monthly coverage graph loads
  // TODO: Check if Highlights cards are displayed
  it('shows home page', () => {
    cy.wait('@apiCalls')
    cy.percySnapshot()
  })

  it('explore button works', () => {
    // Check if explore button
    cy.get('button').contains('Explore').click()
    cy.url().should('include', '/countries')
  })
})
