import { test, expect } from '@playwright/test'
import { scrollToBottom } from './helpers'

test('Home Page Tests', () => {
  test('matches the screenshot', async ({ page }) => {
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    await scrollToBottom(page)

    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      mask: [page.locator('[data-testid="stats-value"]')],
    })
  })
})
