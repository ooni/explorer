import dayjs from '../../services/dayjs'

describe('Search Page Tests', () => {

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
    cy.intercept('/api/v1/*').as('searchAPI')
    cy.get('[data-test-id="load-more-button"]').click()
    cy.wait('@searchAPI')
    cy.get('[data-test-id="results-list"]', { timeout: 10000 }).children('a').should('have.length', 100)
  })

  it('results loaded by "Load More" button are valid', () => {
    cy.intercept('/api/v1/*').as('searchAPI')
    cy.get('[data-test-id="results-list"] > a:nth-child(51)').click()
    cy.url().should('include', '/measurement/')
    cy.go('back')
    cy.wait('@searchAPI')
  })


  it('all filters are usable', () => {
    cy.get('[data-test-id="country-filter"]').select('Italy')
    cy.get('[data-test-id="asn-filter"]').type('12345')

    // click in the since date filter and select range from first to last day of the previous month
    cy.get('#since-filter').click()
    cy.get('.rdp-nav_button_previous').click()
    cy.get('.rdp-cell > .rdp-day').first().click()
    cy.get('.rdp-cell > .rdp-day').last().click()

    cy.get('#apply-range').click()

    cy.get('#since-filter').should(($sinceDate) => {
      const firstOfPreviousMonth = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
      const selectedSinceDate = $sinceDate.val()
      expect(firstOfPreviousMonth).to.equal(selectedSinceDate)
    })

    cy.get('#until-filter').should(($untilDate) => {
      const lastOfPreviousMonth = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
      const selectedUntilDate = $untilDate.val()
      expect(lastOfPreviousMonth).to.equal(selectedUntilDate)
    })

    cy.get('[data-test-id="testname-filter"]').select('Telegram Test')
    cy.get('label').contains('Anomalies').click()
    cy.get('label').contains('All Results').click()

  })

  it('conditional filters are hidden and shown depending on selections', () => {
    cy.get('[data-test-id="domain-filter"]').should('not.exist')
    cy.get('[data-test-id="testname-filter"]').select('Web Connectivity Test')
    cy.get('[data-test-id="domain-filter"]').should('be.visible')
  })
})
