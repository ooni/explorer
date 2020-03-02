/* global describe, it, cy, before */

describe('Countries Page Tests', () => {

  before(() => {
    cy.visit('/countries')
  })

  it('first region (Africa) is visible', () => {
    cy.get(':nth-child(1) > h1')
      .contains('Africa')
      .should('be.visible')
  })

  it('clicking on region in menu scrolls down to the correct region', () => {
    cy.get('a[href="#Europe"]').click({ force: true })
    cy.get(':nth-child(4) > h1')
      .contains('Europe')
      .should('be.visible')
  })
})
