/* global describe, it, cy */

describe('Home Page', () => {
  it('explore button works', () => {
    cy.visit('/')
    cy.get('button').contains('Explore').click()
    cy.url().should('include', '/countries')
  })
})
