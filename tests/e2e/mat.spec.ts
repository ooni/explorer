import { test, expect } from '@playwright/test'

test.describe('MAT Tests', () => {
  test.describe('MAT redirections', () => {
    test('Old /experimental paths redirect to /chart/mat', async ({ page }) => {
      const testPath = '/experimental/mat'
      const testParams =
        '?probe_cc=IR&test_name=web_connectivity&category_code=NEWS&since=2022-03-01&until=2022-04-01&axis_x=measurement_start_day&axis_y=probe_asn'

      const search2Obj = (url: string) => {
        const u = new URL('http://localhost/' + url)
        return Object.fromEntries(u.searchParams.entries())
      }

      await page.goto(testPath + testParams)

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
      await page.goto(
        '/chart/mat?test_name=web_connectivity&since=2022-03-01&until=2022-04-01&axis_x=measurement_start_day&time_grain=day',
      )
      await page.waitForLoadState('networkidle')
    })

    test('it loads', async ({ page }) => {
      await expect(page.getByRole('heading', { level: 1 })).toContainText(
        'Measurement Aggregation Toolkit',
      )
    })

    test('Clicking Submit button loads table and charts', async ({ page }) => {
      await page.getByTestId('mat-form-submit').click()
      await expect(page.getByText('Web Connectivity Test')).toBeVisible()
    })
  })
})
