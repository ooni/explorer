import { test, expect } from '@playwright/test'

const normalColor = 'rgb(47, 158, 68)'
const anomalyColor = 'rgb(230, 119, 0)'
const confirmedColor = 'rgb(240, 62, 62)'
const errorColor = 'rgb(134, 142, 150)'
const ooniBlue = 'rgb(5, 136, 203)'

const tests = {
  web_connectivity: [
    {
      url: '/m/01202003026e2b60ffaa8e1b2bc7865d0bc26659',
      result: 'OK',
      color: normalColor,
      og_description:
        'OONI data suggests prachatai.com was accessible in Ireland on March 2, 2020 at 8:17:40 PM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: '/m/0120200303c6ba9056fe7973cc6b51d15e2ebe18',
      result: 'Anomaly',
      color: anomalyColor,
      og_description:
        'OONI data suggests www.efindlove.com showed signs of HTTP blocking (a blockpage might be served) in Ireland on March 3, 2020 at 6:46:06 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: '/m/01202003039e13e3e38be1918d3a64c2ec27ea22',
      result: 'Blocked',
      color: confirmedColor,
      og_description:
        'OONI data suggests rutor.org was blocked in Russia on March 3, 2020 at 8:15:05 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: '/m/20201029043459.005820_RU_webconnectivity_604f1cb2579d144d',
      result: 'Website Down',
      color: errorColor,
    },
    {
      url: '/m/012019111898e81f78c44cf8689fa32f5d1cb664',
      result: 'Error',
      color: errorColor,
    },
    // {
    //   // missing data in test_keys
    //   result: 'OK',
    //   url: '/m/20210128090058.048012_IT_webconnectivity_0c722fdbe67d8b42',
    //   color: normalColor,
    // },
  ],
  telegram: [
    {
      url: '/m/20221110102858.395748_US_telegram_b2b51fffce62b986',
      result: 'OK',
      color: normalColor,
      og_description:
        'OONI data suggests Telegram was reachable in United States on November 10, 2022 at 10:28:56 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: '/m/20221109225810.435617_RU_telegram_ecbc73cacd8ea566',
      result: 'Anomaly',
      color: anomalyColor,
      og_description:
        'OONI data suggests Telegram was NOT reachable in Russia on November 9, 2022 at 10:57:59 PM UTC, find more open data on internet censorship on OONI Explorer.',
    },
  ],
  whatsapp: [
    {
      url: '/m/20221110103854.762862_US_whatsapp_cb48f652956e71e0',
      result: 'OK',
      color: normalColor,
      og_description:
        'OONI data suggests WhatsApp was reachable in United States on November 10, 2022 at 10:38:53 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: '/m/20221105223930.168194_JP_whatsapp_e3e891f975f0d5ef',
      result: 'Anomaly',
      color: anomalyColor,
      og_description:
        'OONI data suggests WhatsApp was likely blocked in Japan on November 5, 2022 at 10:39:29 PM UTC, find more open data on internet censorship on OONI Explorer.',
    },
  ],
  signal: [
    {
      url: '/m/20210414233242.034345_BR_signal_390dca674022005a',
      result: 'OK',
      color: normalColor,
      og_description:
        'OONI data suggests Signal was reachable in Brazil on April 14, 2021 at 11:32:39 PM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: '/m/20210415084230.511612_IR_signal_ed269d082953bf2e',
      result: 'Anomaly',
      color: anomalyColor,
      og_description:
        'OONI data suggests Signal was NOT reachable in Iran on April 15, 2021 at 8:42:27 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
  ],
  facebook_messenger: [
    {
      url: '/m/01202004070b44da76babb5b2787229c716eb5c0',
      result: 'OK',
      color: normalColor,
      og_description:
        'OONI data suggests Facebook Messenger was reachable in Italy on April 7, 2020 at 9:52:13 PM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: '/m/01202003044cadd4e9b30806be0e72a6e05e161a',
      result: 'Anomaly',
      color: anomalyColor,
      og_description:
        'OONI data suggests Facebook Messenger was NOT reachable in Russia on March 4, 2020 at 5:37:43 PM UTC, find more open data on internet censorship on OONI Explorer.',
    },
  ],
  tor: [
    {
      url: '/m/20221110112405.003769_US_tor_56e03d764ee82e8f',
      result: 'Tor works',
      color: normalColor,
      og_description:
        'OONI data suggests Tor censorship test result in United States on November 10, 2022 at 11:23:02 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: 'm/20230121235805.670038_RU_tor_e8fd37f3f4f1085f',
      result: 'Tor is likely blocked',
      color: anomalyColor,
      og_description:
        'OONI data suggests Tor censorship test result in Russia on January 21, 2023 at 11:58:05 PM UTC, find more open data on internet censorship on OONI Explorer.',
    },
  ],
  psiphon: [
    {
      url: '/m/20221110112249.613770_US_psiphon_58f1cff53798e088',
      result: 'Psiphon works',
      color: normalColor,
      og_description:
        'OONI data suggests Psiphon was reachable in United States on November 10, 2022 at 11:22:43 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: '/m/20220121234007.821843_DE_psiphon_f90aefe2132c91d0',
      result: 'Psiphon is likely blocked',
      color: anomalyColor,
      og_description:
        'OONI data suggests Psiphon was NOT reachable in Germany on January 21, 2022 at 11:39:07 PM UTC, find more open data on internet censorship on OONI Explorer.',
    },
  ],
  http_header_field_manipulation: [
    {
      url: '/m/20221110105736.694076_ES_httpheaderfieldmanipulation_ea459e693b3d42a2',
      result: 'No middleboxes detected',
      color: normalColor,
      og_description:
        'OONI data suggests HTTP header manipulation was not detected in Spain on November 10, 2022 at 10:57:36 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: '/m/20221110104928.397322_IR_httpheaderfieldmanipulation_33ed804ee27d4955',
      result: 'Network tampering',
      color: anomalyColor,
      og_description:
        'OONI data suggests HTTP header manipulation was detected in Iran on November 10, 2022 at 10:49:28 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
  ],
  http_invalid_request_line: [
    {
      url: '/m/20221110105942.212061_TR_httpinvalidrequestline_f99ce62beb3badb9',
      result: 'No middleboxes detected',
      color: normalColor,
      og_description:
        'OONI data suggests Network traffic manipulation was not detected in Türkiye on November 10, 2022 at 10:59:36 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: '/m/20221110105947.714767_US_httpinvalidrequestline_48ce6c10181803ab',
      result: 'Network tampering',
      color: anomalyColor,
      og_description:
        'OONI data suggests Network traffic manipulation was detected in United States on November 10, 2022 at 10:59:45 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
  ],
  ndt: [
    {
      url: '/m/20221110105049.153143_DE_ndt_b15c26280f8b5993',
      result: 'Results',
      color: ooniBlue,
      og_description:
        'OONI data suggests Speed test result (NDT Test) in Germany on November 10, 2022 at 10:50:28 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: '/m/01201911098a2eebcc7e2987c051a332b7769a57',
      result: 'Failed',
      color: ooniBlue,
      og_description:
        'OONI data suggests Speed test result (NDT Test) in United Arab Emirates on November 9, 2019 at 10:37:49 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
  ],
  dash: [
    {
      url: '/m/20221110111106.870773_US_dash_2d879e766e4a5bde',
      result: 'Results',
      color: ooniBlue,
      og_description:
        'OONI data suggests 2160p (4k) quality video streaming at 539.09 Mbit/s speed in United States on November 10, 2022 at 11:11:04 AM UTC, find more open data on internet censorship on OONI Explorer.',
    },
    {
      url: '/m/0120190930e8f3eb8e075af3ffe8e54f33caeae2',
      result: 'Error',
      color: errorColor,
    },
  ],
}

test.describe('Measurement Page Tests', () => {
  test.describe('Accessing old measurement path (/measurement) with report_id and input query', () => {
    test('redirects to the new path with measurement_uid query', async ({
      page,
    }) => {
      await page.goto(
        '/measurement/20221110T100756Z_webconnectivity_US_13335_n1_KWJqHUAPqMdtf2Up?input=https%3A%2F%2Fwww.theguardian.com%2F',
      )

      await expect(page).toHaveURL(
        /\/m\/20221110100919\.165568_US_webconnectivity_782abf479bf32868/,
      )
    })
  })

  for (const testName of Object.keys(tests)) {
    test.describe(testName, () => {
      for (const { url, result, color, og_description } of tests[
        testName as keyof typeof tests
      ]) {
        test(`${result} measurement hero has correct color, text and og:description`, async ({
          page,
        }) => {
          await page.goto(url)

          const hero = page.getByTestId('common-summary')
          await expect(hero).toHaveCSS('background-color', color)
          await expect(hero).toContainText(result)

          if (og_description) {
            await expect(
              page.locator('head meta[property="og:description"]'),
            ).toHaveAttribute('content', og_description)
          }
        })
      }
    })
  }

  test.describe('Invalid Measurements', () => {
    test('URL with invalid measurement_uid says measurement was not found', async ({
      page,
    }) => {
      const reportIdNotInDB = 'this-measurement-does-not-exist'
      await page.goto(`/m/${reportIdNotInDB}`)
      await page.waitForLoadState('networkidle')

      // The NotFound component shows a heading with the title
      const heading = page.locator('h4')
      await expect(heading).toBeVisible()

      // Check that the measurement_uid is displayed somewhere
      await expect(page.getByText(reportIdNotInDB)).toBeVisible()
    })

    // test('Missing measurement_uid in URL says the page cannot be found', async ({
    //   page,
    // }) => {
    //   await page.goto('/m/', { waitUntil: 'domcontentloaded' })

    //   // Should show 404 page with heading
    //   await expect(page.getByRole('heading', { level: 4 })).toBeVisible()
    // })
  })

  test.describe('User Feedback', () => {
    test.beforeEach(async ({ context }) => {
      await context.clearCookies()
    })

    test('can login', async ({ page }) => {
      await page.route('**/api/_/account_metadata', (route) =>
        route.fulfill({ status: 401 }),
      )
      await page.route('**/api/v1/user_register', (route) =>
        route.fulfill({ status: 200 }),
      )

      const measurementUrl =
        '/m/20230307142542.625294_US_webconnectivity_9215f30cf2412f49'
      await page.goto(measurementUrl)
      await page.waitForLoadState('networkidle')

      await page.getByText('VERIFY').click()

      const textbox = page.getByRole('textbox')
      await textbox.click()
      await textbox.fill('randomEmail@randomEmail.com')
      await page.getByText('Login').click()
      await expect(page.getByText('Login link sent')).toBeVisible()
    })

    test('can submit feedback', async ({ page }) => {
      await page.route('**/api/_/account_metadata', (route) =>
        route.fulfill({
          status: 200,
          body: JSON.stringify({ logged_in: true, role: 'user' }),
        }),
      )
      await page.route('**/api/_/measurement_feedback', (route) =>
        route.fulfill({ status: 200 }),
      )

      const measurementUrl =
        '/m/20230307142542.625294_US_webconnectivity_9215f30cf2412f49'

      await page.goto(measurementUrl)
      await page.waitForLoadState('networkidle')

      await page.getByText('VERIFY').click()

      const bodyText = await page.textContent('body')
      if (bodyText?.includes('Your previous feedback')) {
        await page.getByText('Edit').click()
      }

      const form = page.locator('form')
      await form.getByRole('radio', { name: "It's blocked" }).click()
      await form.getByRole('radio', { name: 'Block page' }).first().click()
      await form.getByRole('radio', { name: 'CAPTCHA' }).click()
      await form.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Thank you!')).toBeVisible()
    })
  })

  test.describe('Embedded view with language redirect', () => {
    test('does not redirect if only language is provided', async ({ page }) => {
      await page.goto(
        '/m/20230307142542.625294_US_webconnectivity_9215f30cf2412f49?language=fr',
      )

      await expect(page).toHaveURL(
        'http://localhost:3100/m/20230307142542.625294_US_webconnectivity_9215f30cf2412f49?language=fr',
      )
    })

    test('does not redirect if language is default language', async ({
      page,
    }) => {
      await page.goto(
        '/m/20230307142542.625294_US_webconnectivity_9215f30cf2412f49?webview=true&language=en-US',
      )

      await expect(page).toHaveURL(
        'http://localhost:3100/m/20230307142542.625294_US_webconnectivity_9215f30cf2412f49?webview=true&language=en-US',
      )
    })

    test('does not redirect if language is not supported', async ({ page }) => {
      await page.goto(
        '/m/20230307142542.625294_US_webconnectivity_9215f30cf2412f49?webview=true&language=si',
      )

      await expect(page).toHaveURL(
        'http://localhost:3100/m/20230307142542.625294_US_webconnectivity_9215f30cf2412f49?webview=true&language=si',
      )
    })

    test('redirects if language is supported', async ({ page }) => {
      await page.goto(
        '/m/20230307142542.625294_US_webconnectivity_9215f30cf2412f49?webview=true&language=de',
      )

      await expect(page).toHaveURL(
        'http://localhost:3100/de/m/20230307142542.625294_US_webconnectivity_9215f30cf2412f49?webview=true&language=de',
      )
    })
  })
})
