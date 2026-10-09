import { test, expect } from '@playwright/test'
import { mockApi } from './helpers/mockApi'
import { prepareForScreenshot } from './helpers'

// The network calendar (and any missing date defaults) use Date.now(). Pin
// time so those request URLs stay stable across CI runs.
const FIXED_NOW = '2026-10-08T12:00:00.000Z'

test.describe('Thematic Pages Tests', () => {
  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' })
  })

  // Thematic pages fire one aggregation request per domain (~25 per page).
  // Ignoring `domain` lets all of them share a single fixture per test_name,
  // so charts render recorded data without one file per domain.
  const mockOptions = { ignoreParams: ['domain'] }

  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date(FIXED_NOW))
    // Charts and measurement lists use USER_FEEDBACK_API (api.dev.ooni.io in test).
    await mockApi(page, '**/api.dev.ooni.io/**', 'thematic', mockOptions)
    await mockApi(page, '**/api.ooni.org/**', 'thematic', mockOptions)
  })

  test('social-media - desktop', async ({ page }) => {
    await page.goto(
      '/social-media?since=2025-03-01&until=2025-03-02&probe_cc=CN%2CIR%2CRU',
    )

    await page.waitForLoadState('networkidle')
    await prepareForScreenshot(page)

    await expect(page).toHaveScreenshot('social-media-desktop.png', {
      fullPage: true,
    })
  })

  test('news-media - desktop', async ({ page }) => {
    await page.goto(
      '/news-media?since=2025-03-01&until=2025-03-02&probe_cc=CN%2CIR%2CRU',
    )

    await page.waitForLoadState('networkidle')
    await prepareForScreenshot(page)

    await expect(page).toHaveScreenshot('news-media-desktop.png', {
      fullPage: true,
    })
  })

  test('circumvention - desktop', async ({ page }) => {
    await page.goto(
      '/circumvention?since=2025-03-01&until=2025-03-02&probe_cc=CN%2CIR%2CRU',
    )

    await page.waitForLoadState('networkidle')
    await prepareForScreenshot(page)

    await expect(page).toHaveScreenshot('circumvention-desktop.png', {
      fullPage: true,
    })
  })

  test('domain - desktop', async ({ page }) => {
    await page.goto('/domain/twitter.com?since=2025-03-01&until=2025-03-02')

    await page.waitForLoadState('networkidle')
    await prepareForScreenshot(page)

    await expect(page).toHaveScreenshot('domain-desktop.png', {
      fullPage: true,
    })
  })

  test('network - desktop', async ({ page }) => {
    await page.route('**/api/cloudflare**', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) }),
    )
    await page.route('**/api/ioda**', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) }),
    )

    await page.goto('/as/AS15598?since=2025-04-07&until=2025-04-08')

    await page.waitForLoadState('networkidle')
    await prepareForScreenshot(page)

    await expect(page).toHaveScreenshot('network-desktop.png', {
      fullPage: true,
    })
  })
})
