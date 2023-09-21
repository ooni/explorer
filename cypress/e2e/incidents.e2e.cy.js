const incident = {
  incident: {
    ASNs: [],
    CCs: [],
    domains: [],
    end_time: null,
    event_type: 'incident',
    id: 1234,
    links: [],
    mine: 0,
    published: true,
    reported_by: 'ooni',
    short_description: 'China recently started blocking access to our website (ooni.org) and censorship measurement app (OONI Probe).',
    start_time: '2023-07-07T00:00:00Z',
    tags: [],
    test_names: [],
    text: 'China recently started blocking access to our website (ooni.org) and censorship measurement app (OONI Probe).',
    title: 'China is blocking OONI',
    update_time: '2023-09-14T10:59:31Z'
  }
}

describe('Incidents Dashboard', () => {
  it('admin can see the dashboard', () => {
    cy.intercept('/api/_/account_metadata', {logged_in: true, role: 'admin'}).as('accountMetadata')
    const dashboardUrl = '/incidents/dashboard'
    cy.visit(dashboardUrl)
    cy.wait('@accountMetadata')
    cy.findByText('Incidents Dashboard').should('exist')
  })

  it('redirects user if not logged in', () => {
    cy.intercept('/api/_/account_metadata', {statusCode: 401}).as('accountMetadata')
    const dashboardUrl = '/incidents/dashboard'
    cy.visit(dashboardUrl)
    cy.wait('@accountMetadata')
    cy.findByText('Incidents Dashboard').should('not.exist')
    cy.url({timeout: 6000}).should('eq', 'http://localhost:3100/incidents')
  })

  it('redirects user if not admin', () => {
    cy.intercept('/api/_/account_metadata', {logged_in: true, role: 'user'}).as('accountMetadata')
    const dashboardUrl = '/incidents/dashboard'
    cy.visit(dashboardUrl)
    cy.wait('@accountMetadata')
    cy.findByText('Incidents Dashboard').should('not.exist')
    cy.url({timeout: 6000}).should('eq', 'http://localhost:3100/incidents')
  })
})

describe('Incidents Edit', () => {
  it('admin can see edit incident page', () => {
    cy.intercept('/api/_/account_metadata', {logged_in: true, role: 'admin'}).as('accountMetadata')
    cy.intercept('/api/v1/incidents/show/1234', incident).as('showIncident')
    
    const dashboardUrl = '/incidents/edit/1234'
    cy.visit(dashboardUrl)
    cy.wait('@accountMetadata')
    cy.wait('@showIncident')
    cy.findByText('Edit Incident Report').should('exist')
  })

  it('report creator can see edit incident page', () => {
    cy.intercept('/api/_/account_metadata', {logged_in: true, role: 'user'}).as('accountMetadata')
    cy.intercept('/api/v1/incidents/show/1234', incident).as('showIncident')
    
    const dashboardUrl = '/incidents/edit/1234'
    cy.visit(dashboardUrl)
    cy.wait('@accountMetadata')
    cy.wait('@showIncident')
    cy.findByText('Edit Incident Report').should('exist')
  })

  it('redirects user if not logged in', () => {
    cy.intercept('/api/_/account_metadata', {statusCode: 401}).as('accountMetadata')
    const dashboardUrl = '/incidents/edit/1234'
    cy.visit(dashboardUrl)
    cy.wait('@accountMetadata')
    cy.findByText('Edit Incident Report').should('not.exist')
    cy.url({timeout: 6000}).should('eq', 'http://localhost:3100/incidents')
  })

  it('redirects user if not admin', () => {
    cy.intercept('/api/_/account_metadata', {logged_in: true, role: 'user'}).as('accountMetadata')
    cy.intercept('/api/v1/incidents/show/1234', incident).as('showIncident')

    const dashboardUrl = '/incidents/edit/1234'
    cy.visit(dashboardUrl)
    cy.wait('@accountMetadata')
    cy.wait('@showIncident')
    cy.findByText('Edit Incident Report').should('not.exist')
    cy.url({timeout: 6000}).should('eq', 'http://localhost:3100/incidents')
  })
})