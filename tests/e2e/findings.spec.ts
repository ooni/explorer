import { test, expect } from '@playwright/test'

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
    short_description:
      'China recently started blocking access to our website (ooni.org) and censorship measurement app (OONI Probe).',
    start_time: '2023-07-07T00:00:00Z',
    tags: [],
    test_names: [],
    themes: [],
    text: 'China recently started blocking access to our website (ooni.org) and censorship measurement app (OONI Probe).',
    title: 'China is blocking OONI',
    update_time: '2023-09-14T10:59:31Z',
  },
}

test.describe('Findings Dashboard', () => {
  test('admin can see the dashboard', async ({ page }) => {
    await page.route('**/api/_/account_metadata', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ logged_in: true, role: 'admin' }),
      }),
    )

    await page.goto('/findings/dashboard')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Findings Dashboard')).toBeVisible()
  })

  test('redirects user if not logged in', async ({ page }) => {
    await page.route('**/api/_/account_metadata', (route) =>
      route.fulfill({ status: 401 }),
    )

    await page.goto('/findings/dashboard')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Findings Dashboard')).not.toBeVisible()
    await expect(page).toHaveURL('http://localhost:3100/findings', {
      timeout: 6000,
    })
  })

  test('redirects user if not admin', async ({ page }) => {
    await page.route('**/api/_/account_metadata', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ logged_in: true, role: 'user' }),
      }),
    )

    await page.goto('/findings/dashboard')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Findings Dashboard')).not.toBeVisible()
    await expect(page).toHaveURL('http://localhost:3100/findings', {
      timeout: 6000,
    })
  })
})

test.describe('Findings Edit', () => {
  test('admin can see edit incident page', async ({ page }) => {
    await page.route('**/api/_/account_metadata', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ logged_in: true, role: 'admin' }),
      }),
    )
    await page.route('**/api/v1/incidents/show/1234', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(incident),
      }),
    )

    await page.goto('/findings/edit/1234')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Edit Censorship Finding')).toBeVisible()
  })

  test('report creator can see edit incident page', async ({ page }) => {
    const mineIncident = {
      ...incident,
      incident: {
        ...incident.incident,
        mine: 1,
      },
    }
    await page.route('**/api/_/account_metadata', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ logged_in: true, role: 'user' }),
      }),
    )
    await page.route('**/api/v1/incidents/show/1234', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(mineIncident),
      }),
    )

    await page.goto('/findings/edit/1234')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Edit Censorship Finding')).toBeVisible()
  })

  test('redirects user if not logged in', async ({ page }) => {
    await page.route('**/api/_/account_metadata', (route) =>
      route.fulfill({ status: 401 }),
    )

    await page.goto('/findings/edit/1234')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Edit Censorship Finding')).not.toBeVisible()
    await expect(page).toHaveURL('http://localhost:3100/findings', {
      timeout: 6000,
    })
  })

  test('redirects user if not admin', async ({ page }) => {
    await page.route('**/api/_/account_metadata', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ logged_in: true, role: 'user' }),
      }),
    )
    await page.route('**/api/v1/incidents/show/1234', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify(incident),
      }),
    )

    await page.goto('/findings/edit/1234')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Edit Censorship Finding')).not.toBeVisible()
    await expect(page).toHaveURL('http://localhost:3100/findings', {
      timeout: 6000,
    })
  })
})
