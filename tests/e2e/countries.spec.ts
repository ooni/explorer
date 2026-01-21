import { test, expect } from '@playwright/test'

test.describe('Countries Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/countries')
    await page.waitForLoadState('networkidle')
  })

  test('first region (Africa) is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Africa' })).toBeVisible()
  })

  test('clicking on region in menu scrolls down to the correct region', async ({ page }) => {
    await page.getByRole('link', { name: /Europe/i }).click({ force: true })
    await expect(page.getByRole('heading', { name: 'Europe' })).toBeVisible()
  })
})
