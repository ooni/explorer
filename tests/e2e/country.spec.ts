import { test, expect } from '@playwright/test'

test.describe('Country Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/country/CA')
  })

  // TODO: is overview text is populated
  // TODO: is measurement covergae graph rendered
  // TODO: are research reports loading
  // TODO: are website graphs render
  // TODO: Pagination works
  // TODO: Expanding IM section rows show website graphs

  test('renders the correct country page', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Canada',
    )
  })

  test('renders the correct country flag', async ({ page }) => {
    const flagImage = page.locator('img[src="/static/flags/1x1/ca.svg"]')
    await expect(flagImage).toBeVisible()
  })
})

test.describe('Country Page Handles Case Mistakes In URL', () => {
  test('when both letters lower case', async ({ page }) => {
    await page.goto('/country/ca')
    await expect(page).toHaveURL(/\/country\/CA/)
  })

  test('when first letter lower case', async ({ page }) => {
    await page.goto('/country/Ca')
    await expect(page).toHaveURL(/\/country\/CA/)
  })

  test('when second letter lower case', async ({ page }) => {
    await page.goto('/country/cA')
    await expect(page).toHaveURL(/\/country\/CA/)
  })
})

test('Country page charts websites by year over several years', async ({
  page,
}) => {
  const websites = page.waitForRequest(
    (r) => new URL(r.url()).searchParams.get('axis_y') === 'domain',
  )
  await page.goto('/country/CA?since=2023-01-01&until=2026-10-09')
  const url = new URL((await websites).url())
  expect(url.searchParams.get('time_grain')).toBe('year')
})
