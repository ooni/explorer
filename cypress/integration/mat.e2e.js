describe('MAT Tests', () => {

  describe('MAT redirections', () => {
    it('Old /experimental paths redirect to /chart/mat', () => {
      const testPath = '/experimental/mat'
      const testParams = '?probe_cc=IR&test_name=web_connectivity&category_code=NEWS&since=2022-03-01&until=2022-04-01&axis_x=measurement_start_day&axis_y=probe_asn'
      
      const search2Obj = (url) => {
        const u = new URL('http://localhost/' + url)
        return Object.fromEntries(u.searchParams.entries())
      }
      cy.visit(testPath + testParams)
      
      cy.location().should(loc => {
        expect(loc.pathname).equals('/chart/mat')
        expect(search2Obj(loc.search)).to.deep.equal(search2Obj(testParams))
      })
    })
  })

  describe('MAT Basics', () => {
    before(() => {
      cy.visit('http://localhost:3100/chart/mat?test_name=web_connectivity&since=2022-03-01&until=2022-04-01&axis_x=measurement_start_day')
    })

    it('it loads', () => {
      cy.get('h1').contains('Measurement Aggregation Toolkit')
    })

    it.only('Clicking Submit button loads table and charts', () => {
      cy.get('button[data-test-id=mat-form-submit]').click()
      cy.contains('Web Connectivity Test')
    })
  })
})
