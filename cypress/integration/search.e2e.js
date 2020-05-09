/* global describe, it, cy, before */

describe('Seearch Page Tests', () => {

  before(() => {
    cy.visit('/search')
  })

  // TODO: Check if all form elements are actionable
  // TODO: Check if conditional form elements render (or not) correctly

  it('default filter shows 50 results', () => {
    // Check if search results appear upon page load
    cy.get('[data-test-id="results-list"]').children('a').should('have.length.above', 1)
      .each(($el) => {
        cy.wrap($el)
          .should('have.attr', 'href')
          .and('match', /measurement/)
      })
  })

  it.only('shows search results when filter changes', () => {
    cy.get('select[name="testNameFilter"]').select('web_connectivity')
    cy.get('button').contains('Filter Results').should('not.be.disabled').click()
    cy.get('[data-test-id="results-list"]', { timeout: 10000 })
      .children('a')
      .should('have.length.above', 1)
      .each(($el) => {
        cy.wrap($el)
          .contains('Web Connectivity')
      })
  })
})
