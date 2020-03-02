/* global describe, it, cy, before */

describe('Seearch Page Tests', () => {

  before(() => {
    cy.visit('/search')
  })

  // TODO: Check if all form elements are actionable
  // TODO: Check if conditional form elements render (or not) correctly
  // TODO: Check if submitting search query returns results

  it('default filter shows 50 results', () => {
    // Check if search results appear upon page load
    cy.get('[data-test-id="results-list"]').children('a').should('have.length', 50)
      .each(($el) => {
        cy.wrap($el)
          .should('have.attr', 'href')
          .and('match', /measurement/)
      })
  })
})
