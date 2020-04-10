/* global describe, it, cy, before */

describe('Country Page Tests', () => {

  before(() => {
    cy.visit('/country/CA')
  })

  // TODO: is overview text is populated
  // TODO: is measurement covergae graph rendered
  // TODO: are research reports loading
  // TODO: are website graphs render
  // TODO: Pagination works
  // TODO: Expanding IM section rows show website graphs

  it('renders the correct country page', () => {
    cy.get('h1').contains('Canada')
  })

  it('renders the correct country flag', () => {
    cy.get('img').should('have.attr', 'src', '/static/flags/1x1/ca.svg')
  })
})

describe('Country Page Handles Case Mistakes In URL', () => {

  it('when both letters lower case' , () => {
    cy.visit('/country/ca')
    cy.url().should('include', '/country/CA')

  })

  it('when first letter lower case' , () => {
    cy.visit('/country/Ca')
    cy.url().should('include', '/country/CA')
  })

  it('when second letter lower case', () => {
    cy.visit('/country/cA')
    cy.url().should('include', '/country/CA')
  })

})