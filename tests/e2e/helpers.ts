import { expect, type Page } from '@playwright/test'

// Scroll to bottom of the page so that all the lazy loaded content is loaded
export const scrollToBottom = async (page: Page) => {
  await page.evaluate(async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms))
    for (let i = 0; i < document.body.scrollHeight; i += 100) {
      window.scrollTo(0, i)
      await delay(100)
    }
  })
}

// Wait for all network requests to complete
export const waitForAllRequests = async (page: Page) => {
  await page.waitForLoadState('networkidle', { timeout: 30000 })

  // Wait for all images to be loaded
  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((resolve) => {
              img.onload = resolve
              img.onerror = resolve
              setTimeout(() => resolve(null), 10000)
            }),
        ),
    )
  })

  await page.waitForLoadState('networkidle', { timeout: 10000 })
}
