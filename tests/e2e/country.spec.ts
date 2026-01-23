import { test, expect } from '@playwright/test'

test.describe('Country Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/country/CA')
    await page.waitForLoadState('networkidle')
  })

  // TODO: is overview text is populated
  // TODO: is measurement covergae graph rendered
  // TODO: are research reports loading
  // TODO: are website graphs render
  // TODO: Pagination works
  // TODO: Expanding IM section rows show website graphs

  test('renders the correct country page', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Canada',
    )
  })

  test('renders the correct country flag', async ({ page }) => {
    const flagImage = page.locator('img[src="/static/flags/1x1/ca.svg"]')
    await expect(flagImage).toBeVisible()
  })
})

test.describe('Country Page Handles Case Mistakes In URL', () => {
  test('when both letters lower case', async ({ page }) => {
    await page.goto('/country/ca')
    await expect(page).toHaveURL(/\/country\/CA/)
  })

  test('when first letter lower case', async ({ page }) => {
    await page.goto('/country/Ca')
    await expect(page).toHaveURL(/\/country\/CA/)
  })

  test('when second letter lower case', async ({ page }) => {
    await page.goto('/country/cA')
    await expect(page).toHaveURL(/\/country\/CA/)
  })
})
