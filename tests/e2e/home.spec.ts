import { test, expect } from '@playwright/test'
import { mockApi } from './helpers/mockApi'
import { prepareForScreenshot } from './helpers'

// CoverageChart summary text uses "last month" relative to Date.now().
const FIXED_NOW = '2026-10-08T12:00:00.000Z'

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date(FIXED_NOW))
    await mockApi(page, '**/api.ooni.org/**', 'home')
  })

  test.afterEach(async ({ page }) => {
    await page.unrouteAll({ behavior: 'ignoreErrors' })
  })

  test('matches the screenshot', async ({ page }) => {
    await page.goto('/')

    await page.waitForResponse('**/global_overview_by_month**')
    await prepareForScreenshot(page)

    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      // Banner totals come from getStaticProps (server); monthly summary uses live dates.
      mask: [page.locator('[data-testid="stats-value"]')],
    })
  })
})
