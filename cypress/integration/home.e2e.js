/* global describe, it, cy, before */

describe('Home Page Tests', () => {

  before(() => {
    cy.visit('/')
    cy.screenshot('home-page')
  })

  // TODO: Check if stats appear
  // TODO: Check if monthly coverage graph loads
  // TODO: Check if Highlights cards are displayed

  it('explore button works', () => {
    // Check if explore button
    cy.get('button').contains('Explore').click()
    cy.url().should('include', '/countries')
  })
})
