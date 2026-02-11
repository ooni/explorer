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
  })

  test('can access "HTTP Hosts" measurements', async ({ page }) => {
    await page.goto('/search?until=2015-03-31&since=2014-12-01')
    await page.waitForLoadState('networkidle')

    await page.getByTestId('testname-filter').selectOption('http_host')

    const filterButton = page.getByRole('button', { name: 'Filter Results' })
    await expect(filterButton).toBeEnabled()
    await filterButton.click()

    const resultsList = page.getByTestId('results-list').getByRole('link')
    await expect(resultsList).toHaveCount(50)
  })

  test('legacy measurement page shows enough information', async ({ page }) => {
    await page.goto('/m/01201503307dd8855f39f3d8f78be05f0c67770d')
    await page.waitForLoadState('networkidle')

    await expect(page.getByTestId('common-summary')).toContainText('Canada')
    await expect(page.getByTestId('common-summary')).toContainText('AS812')
    await expect(page.getByTestId('common-summary')).toContainText(
      'March 30, 2015 at 9:12:43 PM UTC',
    )
    // Raw measurement rendered?
  })
})
