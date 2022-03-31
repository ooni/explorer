describe('MAT Tests', () => {

  describe('MAT redirections', () => {
    it('Old /experimental paths redirect to /chart/mat', () => {
      cy.visit('/experimental/mat?probe_cc=IR&test_name=web_connectivity&category_code=NEWS&since=2022-03-01&until=2022-04-01&axis_x=measurement_start_day&axis_y=probe_asn')
      cy.url().should('include', '/chart/mat')
    })
  })

  describe('MAT Basics', () => {
    before(() => {
      cy.visit('/chart/mat')
    })

    it('it loads', () => {
      cy.get('h1').contains('Measurement Aggregation Toolkit')
    })
  })
})
