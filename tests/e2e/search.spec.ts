import dayjs from '../../services/dayjs'
import { test, expect } from '@playwright/test'

test.describe('Search Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/**', async (route) => {
      const request = route.request()

      // Handle OPTIONS preflight requests
      if (request.method() === 'OPTIONS') {
        await route.fulfill({
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
          },
        })
        return
      }

      // For actual requests, fetch and add CORS headers
      const response = await route.fetch()
      const body = await response.body()
      const headers = response.headers()

      await route.fulfill({
        status: response.status(),
        headers: {
          ...headers,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
        },
        body: body,
      })
    })

    await page.goto('/search')
    await page.waitForLoadState('networkidle')
  })

  test('default filter shows 50 results', async ({ page }) => {
    // Check if search results appear upon page load
    const links = page.getByTestId('results-list').getByRole('link')

    await expect(links).toHaveCount(50)

    // Verify each link has href matching /m/
    const count = await links.count()
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href')
      expect(href).toMatch(/\/m\//)
    }
  })

  test('shows relevant search results when filter changes', async ({
    page,
  }) => {
    await page.getByTestId('testname-filter').selectOption('web_connectivity')

    const filterButton = page.getByRole('button', { name: 'Filter Results' })
    await expect(filterButton).toBeEnabled()
    await filterButton.click()

    await page.waitForResponse('**/api/v1/measurements*')

    // Wait for results to update
    const resultsList = page.getByTestId('results-list').getByRole('link')
    const count = await resultsList.count()
    await expect(resultsList).toHaveCount(50)

    // Verify all results contain 'Web Connectivity'
    for (let i = 0; i < count; i++) {
      const text = await resultsList.nth(i).textContent()
      expect(text).toContain('Web Connectivity')
    }
  })

  test('fetches more results when "Load More" button is clicked', async ({
    page,
  }) => {
    await page.getByTestId('load-more-button').click()

    // Wait for API call and results to update
    await page.waitForResponse('**/api/v1/measurements*')

    const resultsList = page.getByTestId('results-list').getByRole('link')
    await expect(resultsList).toHaveCount(100)
  })

  test('all filters are usable', async ({ page }) => {
    await page.getByTestId('country-filter').selectOption('Italy')
    await page.getByTestId('asn-filter').fill('12345')

    // Click in the since date filter and select range from first to last day of the previous month
    await page.locator('#since-filter').click()

    // Click previous month button (react-day-picker uses aria-label or button with class nav_button_previous)
    await page
      .locator('button.nav_button_previous, button[aria-label*="previous"]')
      .click()

    // Click first and last day buttons
    const dayButtons = page.locator('button[name="day"]')

    await dayButtons.first().click()
    await dayButtons.last().click()

    await page.locator('#apply-range').click()

    const sinceFilter = page.locator('#since-filter')
    const firstOfPreviousMonth = dayjs()
      .subtract(1, 'month')
      .startOf('month')
      .format('YYYY-MM-DD')
    await expect(sinceFilter).toHaveValue(firstOfPreviousMonth)

    const untilFilter = page.locator('#until-filter')
    const lastOfPreviousMonth = dayjs()
      .subtract(1, 'month')
      .endOf('month')
      .format('YYYY-MM-DD')
    await expect(untilFilter).toHaveValue(lastOfPreviousMonth)

    await page.getByTestId('testname-filter').selectOption('Telegram Test')
    await page.getByRole('radio', { name: 'Anomalies' }).click()
    await page.getByRole('radio', { name: 'All Results' }).click()
  })

  test('conditional filters are hidden and shown depending on selections', async ({
    page,
  }) => {
    await page.getByTestId('testname-filter').selectOption('Signal Test')
    await expect(page.getByTestId('domain-filter')).not.toBeVisible()

    await page
      .getByTestId('testname-filter')
      .selectOption('Web Connectivity Test')
    await expect(page.getByTestId('domain-filter')).toBeVisible()
  })
})
