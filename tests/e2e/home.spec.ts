import { test, expect } from '@playwright/test'
import { prepareForScreenshot } from './helpers'

test.describe('Home Page Tests', () => {
  test('matches the screenshot', async ({ page }) => {
    await page.goto('/')

    await prepareForScreenshot(page)

    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      mask: [page.locator('[data-testid="stats-value"]')],
    })
  })
})
