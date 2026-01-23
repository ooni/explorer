import { test, expect } from '@playwright/test'

test.describe('MAT Tests', () => {
  test.describe('MAT redirections', () => {
    test('Old /experimental paths redirect to /chart/mat', async ({ page }) => {
      const testPath = '/experimental/mat'
      const testParams =
        '?probe_cc=IR&test_name=web_connectivity&category_code=NEWS&since=2022-03-01&until=2022-03-04&axis_x=measurement_start_day&axis_y=probe_asn&time_grain=day'

      const search2Obj = (url: string) => {
        const u = new URL(`http://localhost:3100/${url}`)
        return Object.fromEntries(u.searchParams.entries())
      }

      await page.goto(`${testPath}${testParams}`)
      // await page.waitForLoadState('networkidle')

      const url = page.url()
      expect(url).toContain('/chart/mat')

      const urlObj = new URL(url)
      const expectedParams = search2Obj(testParams)
      const actualParams = Object.fromEntries(urlObj.searchParams.entries())

      expect(actualParams).toEqual(expectedParams)
    })
  })

  test.describe('MAT Basics', () => {
    test.beforeEach(async ({ page }) => {
      await page.route('**/api/v1/aggregation**', async (route) => {
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

      await page.goto(
        '/chart/mat?test_name=web_connectivity&since=2022-03-01&until=2022-03-04&axis_x=measurement_start_day&time_grain=day',
        {
          waitUntil: 'networkidle', // Wait for network to be idle
        },
      )
      // await page.waitForLoadState('networkidle')
    })

    test('it loads', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toContainText(
        'Measurement Aggregation Toolkit',
      )
      await page.unrouteAll({ behavior: 'ignoreErrors' })
    })

    test('Clicking Submit button loads table and charts', async ({ page }) => {
      await page.getByTestId('mat-form-submit').click()
      await expect(page.getByTestId('mat-chart')).toContainText(
        'Web Connectivity Test',
      )
      await page.unrouteAll({ behavior: 'ignoreErrors' })
    })
  })
})
