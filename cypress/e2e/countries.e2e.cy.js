describe('Countries Page Tests', () => {
  before(() => {
    cy.visit('/countries')
  })

  it('first region (Africa) is visible', () => {
    cy.get('h2').contains('Africa').should('be.visible')
  })

  it('clicking on region in menu scrolls down to the correct region', () => {
    cy.get('a[href="#Europe"]').click({ force: true })
    cy.get('h2').contains('Europe').should('be.visible')
  })
})
