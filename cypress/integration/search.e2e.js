/* global describe, it, cy, before, Cypress, expect */

describe('Seearch Page Tests', () => {

  before(() => {
    cy.visit('/search')
  })

  it('default filter shows 50 results', () => {
    // Check if search results appear upon page load
    cy.get('[data-test-id="results-list"]').children('a').should('have.length', 50)
      .each(($el) => {
        cy.wrap($el)
          .should('have.attr', 'href')
          .and('match', /measurement/)
      })
  })

  it('shows relevant search results when filter changes', () => {
    cy.get('select[name="testNameFilter"]').select('web_connectivity')
    cy.get('button').contains('Filter Results').should('not.be.disabled').click()
    cy.get('[data-test-id="results-list"]', { timeout: 10000 })
      .children('a')
      .should('have.length', 50)
      .each(($el) => {
        cy.wrap($el)
          .contains('Web Connectivity')
      })
  })

  it('fetches more results when "Load More" button is clicked', () => {
    cy.get('[data-test-id="load-more-button"]').click()
    cy.get('[data-test-id="results-list"]').children('a').should('have.length', 100)
  })

  it('results loaded by "Load More" button are valid', () => {
    cy.get('[data-test-id="results-list"] > a:nth-child(51)').click()
    cy.url().should('include', '/measurement/')
    cy.go('back')
  })


  it('all filters are usable', () => {
    cy.get('[data-test-id="country-filter"]').select('Italy')
    cy.get('[data-test-id="asn-filter"]').type('12345')

    // click in the since date filter and select last day of prev month
    cy.get('#since-filter').click()
    cy.get('.rdt.rdtOpen > .rdtPicker > .rdtDays > table > tbody > :nth-child(1)')
      .within(($firstRow) => {
        cy.wrap($firstRow).contains(/31|30|29|28/).click()
      })
    cy.get('#since-filter').should(($sinceDate) => {
      const firstOfMonth = Cypress.moment().startOf('month')
      const selectedSinceDate = $sinceDate.val()
      expect(firstOfMonth.isAfter(selectedSinceDate)).to.be.true
    })

    // click in the until date filter and select a day before today
    cy.get('#until-filter').click()
    cy.get('.rdt.rdtOpen .rdtToday').click()
    cy.get('#until-filter').should(($untilDate) => {
      const firstOfMonth = Cypress.moment().startOf('month')
      const selectedUntilDate = $untilDate.val()
      expect(firstOfMonth.isSameOrBefore(selectedUntilDate)).to.be.true
    })

    cy.get('[data-test-id="testname-filter"]').select('Telegram')
    cy.get('label').contains('Anomalies').click()
    cy.get('label').contains('All Results').click()

  })

  it('conditional filters are hidden and shown depending on selections', () => {
    cy.get('[data-test-id="domain-filter"]').should('not.be.visible')
    cy.get('[data-test-id="testname-filter"]').select('Web Connectivity')
    cy.get('[data-test-id="domain-filter"]').should('be.visible')
  })
})
