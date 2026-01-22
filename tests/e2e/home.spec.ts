import { test, expect } from '@playwright/test'

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  // TODO: Check if stats appear
  // TODO: Check if monthly coverage graph loads
  // TODO: Check if Highlights cards are displayed

  test('explore button works', async ({ page }) => {
    const exploreLink = page.getByRole('link', { name: 'Explore' }).first()

    await exploreLink.click()
    await expect(page).toHaveURL(/\/chart\/mat/)
  })
})
