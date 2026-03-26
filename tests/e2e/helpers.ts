import type { Page } from '@playwright/test'

/**
 * Proxies browser API requests (see route glob in implementation) through the
 * real network and adds CORS headers so calls from the Next app to OONI API
 * succeed in Playwright (OPTIONS + passthrough for GET/POST/etc.).
 */
export async function routeApiWithCors(page: Page): Promise<void> {
  await page.route('**/api/**', async (route) => {
    const request = route.request()

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
      body,
    })
  })
}

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
