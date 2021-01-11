/* global describe, it, cy, before */

describe('Home Page Tests', () => {

  before(() => {
    cy.intercept(
      'GET',
      '/api/_/global_overview_by_month',
      { fixture: 'globalMonthlyStatApi.json' }
    ).as('globalMonthlyStatApi')

    cy.visit('/')
  })

  // TODO: Check if stats appear
  // TODO: Check if monthly coverage graph loads
  // TODO: Check if Highlights cards are displayed
  it('shows home page', () => {
    cy.wait('@globalMonthlyStatApi')
    cy.percySnapshot()
  })

  it('explore button works', () => {
    // Check if explore button
    cy.get('button').contains('Explore').click()
    cy.url().should('include', '/countries')
  })
})
