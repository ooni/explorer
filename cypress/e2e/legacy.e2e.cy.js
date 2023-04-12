describe('Seearch Page Tests', () => {

  it('can lookup legacy data', () => {
    cy.visit('/search?until=2015-03-31&since=2014-12-01')
  })

  it('shows page full of results', () => {
    cy.get('[data-test-id="results-list"]').children('a').should('have.length.of.at.least', 48)
  })

  it.skip('can access "HTTP Hosts" measurements', () => {
    cy.get('select[name="testNameFilter"]').select('http_host')
    cy.get('button').contains('Filter Results').should('not.be.disabled').click()
    cy.get('[data-test-id="results-list"]', { timeout: 10000 })
      .children('a')
      .should('have.length.of.at.least', 49)
      .each(($el) => {
        cy.wrap($el)
          .should('have.attr', 'href')
          .and('match', /m/)
          .then((href) => {
            cy.request(href)
          })
      })
  })

  it.skip('legacy measurement page shows enough information', () => {
    cy.visit('/m/01201503307dd8855f39f3d8f78be05f0c67770d')
    cy.contains('Country').siblings().contains('Canada')
    cy.contains('Network').siblings().contains('AS812')
    cy.contains('Date & Time').siblings().contains('March 30, 2015, 11:12 PM UTC')
    // Raw measurement rendered?
  })
})