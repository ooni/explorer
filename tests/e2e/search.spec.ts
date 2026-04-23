import dayjs from '../../services/dayjs'
import { test, expect } from '@playwright/test'
import { routeApiWithCors, scrollToBottom } from './helpers'

test.describe('Search Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await routeApiWithCors(page)

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

    await page.waitForLoadState('networkidle')

    await scrollToBottom(page)

    await expect(page).toHaveScreenshot('search-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.12,
    })
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

    // Click previous month button (react-day-picker v9: aria-label "Go to the Previous Month")
    await page.getByRole('button', { name: /previous month/i }).click()

    // Click first and last day buttons
    const dayButtons = page.getByRole('gridcell').locator('button')

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
