import { test, expect, type Page } from '@playwright/test'

// Scroll to bottom of the page so that all the lazy loaded content is loaded
const scrollToBottom = async (page: Page) => {
  await page.evaluate(async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms))
    for (let i = 0; i < document.body.scrollHeight; i += 100) {
      window.scrollTo(0, i)
      await delay(100)
    }
  })
}

test.describe('Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Block any css requests for each test in this file.
    // await context.route(/.css$/, route => route.abort());

    // await page.addStyleTag({
    //   content: `
    //     __next-build-watcher,
    //     nextjs-portal {
    //       display: none !important;
    //     }
    //   `,
    // })

    await page.route('**/api/v1/aggregation', (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          results: [],
        }),
      }),
    )

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

  test('homepage - desktop', async ({ page }) => {
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    await scrollToBottom(page)

    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      fullPage: true,
      mask: [page.locator('[data-testid="stats-value"]')],
    })
  })

  test('social-media - desktop', async ({ page }) => {
    await page.goto(
      '/social-media?since=2025-03-01&until=2025-03-02&probe_cc=CN%2CIR%2CRU',
    )

    await page.waitForLoadState('networkidle')

    // await scrollToBottom(page)

    await expect(page).toHaveScreenshot('social-media-desktop.png', {
      //   fullPage: true,
    })
  })

  test('news-media - desktop', async ({ page }) => {
    await page.goto(
      '/news-media?since=2025-03-01&until=2025-03-02&probe_cc=CN%2CIR%2CRU',
    )

    await page.waitForLoadState('networkidle')

    await scrollToBottom(page)

    await expect(page).toHaveScreenshot('news-media-desktop.png', {
      fullPage: true,
    })
  })

  test('circumvention - desktop', async ({ page }) => {
    await page.goto(
      '/circumvention?since=2025-03-01&until=2025-03-02&probe_cc=CN%2CIR%2CRU',
    )

    await page.waitForLoadState('networkidle')

    // await scrollToBottom(page)

    await expect(page).toHaveScreenshot('circumvention-desktop.png', {
      //   fullPage: true,
    })
  })

  test('domain - desktop', async ({ page }) => {
    await page.goto('/domain/twitter.com?since=2025-03-01&until=2025-03-02')

    await page.waitForLoadState('networkidle')

    // await scrollToBottom(page)

    await expect(page).toHaveScreenshot('domain-desktop.png', {
      fullPage: true,
    })
  })

  test('network - desktop', async ({ page }) => {
    await page.goto('/as/AS15598?since=2025-04-07&until=2025-04-08')

    await page.waitForLoadState('networkidle')

    // await scrollToBottom(page)

    await expect(page).toHaveScreenshot('network-desktop.png', {
      fullPage: true,
    })

    await page.unrouteAll({ behavior: 'ignoreErrors' })
  })

  test('mat - desktop', async ({ page }) => {
    await page.goto(
      '/chart/mat?test_name=web_connectivity&axis_x=measurement_start_day&since=2025-03-01&until=2025-03-02&time_grain=day',
    )

    await page.waitForLoadState('networkidle')

    await scrollToBottom(page)

    await expect(page).toHaveScreenshot('mat-desktop.png', {
      fullPage: true,
    })
  })

  test('search - desktop', async ({ page }) => {
    await page.goto('/search?since=2025-03-01&until=2025-03-02&failure=false')

    await page.waitForLoadState('networkidle')

    await scrollToBottom(page)

    await expect(page).toHaveScreenshot('search-desktop.png', {
      fullPage: true,
    })
  })

  test('web-connectivity-OK - desktop', async ({ page }) => {
    await page.goto(
      '/m/20250417130101.205170_IR_webconnectivity_42664e94d85d48eb',
    )

    await page.waitForLoadState('networkidle')

    // await scrollToBottom(page)

    await expect(page).toHaveScreenshot('web-connectivity-OK-desktop.png', {
      fullPage: true,
    })
  })

  test('web-connectivity-CONFIRMED - desktop', async ({ page }) => {
    await page.goto(
      '/m/20250417130231.077567_IR_webconnectivity_686a5762b08f5baf',
    )

    await page.waitForLoadState('networkidle')

    // await scrollToBottom(page)

    await expect(page).toHaveScreenshot(
      'web-connectivity-CONFIRMED-desktop.png',
      {
        fullPage: true,
      },
    )
  })

  //   test('homepage - mobile', async ({ page }) => {
  //     await page.setViewportSize({ width: 375, height: 667 });
  //     await page.goto('/');
  //     await page.waitForLoadState('networkidle');

  //     await expect(page).toHaveScreenshot('homepage-mobile.png');
  //   });
})
