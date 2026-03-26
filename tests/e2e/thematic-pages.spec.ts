import { test, expect } from '@playwright/test'
import { routeApiWithCors, scrollToBottom } from './helpers'

test.describe('Thematic Pages Tests', () => {
  test.beforeEach(async ({ page }) => {
    await routeApiWithCors(page)
  })

  test('social-media - desktop', async ({ page }) => {
    await page.goto(
      '/social-media?since=2025-03-01&until=2025-03-02&probe_cc=CN%2CIR%2CRU',
    )

    await page.waitForLoadState('networkidle')

    await scrollToBottom(page)

    await expect(page).toHaveScreenshot('social-media-desktop.png', {
      fullPage: true,
    })
  })

  test('news-media - desktop', async ({ page }) => {
    await page.goto(
      '/news-media?since=2025-03-01&until=2025-03-02&probe_cc=CN%2CIR%2CRU',
    )

    await page.waitForLoadState('networkidle')

    // await scrollToBottom(page)

    await expect(page).toHaveScreenshot('news-media-desktop.png', {
    //   fullPage: true,
    })
  })

  test('circumvention - desktop', async ({ page }) => {
    await page.goto(
      '/circumvention?since=2025-03-01&until=2025-03-02&probe_cc=CN%2CIR%2CRU',
    )

    await page.waitForLoadState('networkidle')

    // await scrollToBottom(page)

    await expect(page).toHaveScreenshot('circumvention-desktop.png', {
        // fullPage: true,
    })
  })

  test('domain - desktop', async ({ page }) => {
    await page.goto('/domain/twitter.com?since=2025-03-01&until=2025-03-02')

    await page.waitForLoadState('networkidle')

    // await scrollToBottom(page)

    await expect(page).toHaveScreenshot('domain-desktop.png', {
    //   fullPage: true,
    })
  })

  test('network - desktop', async ({ page }) => {
    await page.goto('/as/AS15598?since=2025-04-07&until=2025-04-08')

    await page.waitForLoadState('networkidle')

    // await scrollToBottom(page)

    await expect(page).toHaveScreenshot('network-desktop.png', {
    //   fullPage: true,
    })

    await page.unrouteAll({ behavior: 'ignoreErrors' })
  })
})