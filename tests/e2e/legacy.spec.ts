import { test, expect } from '@playwright/test'
import { routeApiWithCors } from './helpers'

test.describe('Search Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await routeApiWithCors(page)
  })

  // test('can access "HTTP Hosts" measurements', async ({ page }) => {
  //   await page.goto('/search?until=2015-03-31&since=2014-12-01')
  //   await page.waitForLoadState('networkidle')

  //   await page.getByTestId('testname-filter').selectOption('http_host')

  //   const filterButton = page.getByRole('button', { name: 'Filter Results' })
  //   await expect(filterButton).toBeEnabled()
  //   await filterButton.click()

  //   const resultsList = page.getByTestId('results-list').getByRole('link')
  //   await expect(resultsList).toHaveCount(50)
  // })

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
