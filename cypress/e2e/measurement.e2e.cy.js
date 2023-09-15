import { failedAccountMetadata } from '/cypress/mocks/handlers'

describe('Measurement Page Tests', () => {

  const normalColor = 'rgb(47, 158, 68)'
  const anomalyColor = 'rgb(230, 119, 0)'
  const confirmedColor = 'rgb(240, 62, 62)'
  const errorColor = 'rgb(134, 142, 150)'
  const ooniBlue = 'rgb(5, 136, 203)'

  describe('Accessing old measurement path (/measurement) with report_id and input query', () => {
    it('redirects to the new path with measurement_uid query', () => {
      cy.visit('/measurement/20221110T100756Z_webconnectivity_US_13335_n1_KWJqHUAPqMdtf2Up?input=https%3A%2F%2Fwww.theguardian.com%2F')

      cy.url()
        .should('include', '/m/20221110100919.165568_US_webconnectivity_782abf479bf32868')
    })
  })

  describe('Web Connectivity tests', () => {
    it('renders a valid accessible og:description', () => {
      cy.visit('/m/20221110100919.165568_US_webconnectivity_782abf479bf32868')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests www.theguardian.com was accessible in United States on November 10, 2022 at 10:09:16 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders a valid blocked og:description', () => {
      cy.visit('/m/20211215054456.786934_RU_webconnectivity_afd23582493d6255')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests rutor.org was blocked in Russia on December 15, 2021 at 5:44:55 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders a valid anomaly og:description', () => {
      cy.visit('/m/20221110102552.617947_MY_webconnectivity_34d88ce2e81a5404')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests www.google.com was accessible in Malaysia on November 10, 2022 at 10:25:51 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    // it('renders a valid website down og:description', () => {
    //   cy.visit('')
    //   cy.get('head meta[property="og:description"]')
    //     .should('have.attr', 'content', '')
    // })

    it('an accessible measurement is green and says "OK"', () => {
      cy.visit('/m/01202003026e2b60ffaa8e1b2bc7865d0bc26659')
      cy.heroHasColor(normalColor)
        .contains('OK')
    })

    it('an anomaly measurement is orange and says "Anomaly"', () => {
      cy.visit('/m/0120200303c6ba9056fe7973cc6b51d15e2ebe18')
      cy.heroHasColor(anomalyColor)
        .contains('Anomaly')
    })

    it('a blocked measurement is red and says "Blocked"', () => {
      cy.visit('/m/01202003039e13e3e38be1918d3a64c2ec27ea22')
      cy.heroHasColor(confirmedColor)
        .contains('Blocked')
    })

    it('shows that the website measurement was for a down site', () => {
      cy.visit('/m/20201029043459.005820_RU_webconnectivity_604f1cb2579d144d')
      cy.heroHasColor(errorColor)
        .contains('Website Down')
    })

    it('renders a failed measurement', () => {
      cy.visit('/m/012019111898e81f78c44cf8689fa32f5d1cb664')
      cy.heroHasColor(errorColor)
        .contains('Error')
    })

    it('renders a measurement with missing data in test_keys', () => {
      cy.visit('/m/20210128090058.048012_IT_webconnectivity_0c722fdbe67d8b42')
    })
  })

  describe('Telegram Tests', () => {
    it('renders a reachable og:description', () => {
      cy.visit('/m/20221110102858.395748_US_telegram_b2b51fffce62b986')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Telegram was reachable in United States on November 10, 2022 at 10:28:56 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders a unreachable og:description', () => {
      cy.visit('/m/20221109225810.435617_RU_telegram_ecbc73cacd8ea566')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Telegram was NOT reachable in Russia on November 9, 2022 at 10:57:59 PM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders an accessible measurement', () => {
      cy.visit('/m/01202003046b5320b707898e4fff81a51f1837f1')
      cy.heroHasColor(normalColor)
        .contains('OK')
    })

    it('renders an anomaly measurement', () => {
      cy.visit('/m/20221109225810.435617_RU_telegram_ecbc73cacd8ea566')
      cy.heroHasColor(anomalyColor)
        .contains('Anomaly')
    })
  })

  describe('WhatsApp Tests', () => {
    it('renders a reachable og:description', () => {
      cy.visit('/m/20221110103854.762862_US_whatsapp_cb48f652956e71e0')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests WhatsApp was reachable in United States on November 10, 2022 at 10:38:53 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders an unreachable og:description', () => {
      cy.visit('/m/20221105223930.168194_JP_whatsapp_e3e891f975f0d5ef')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests WhatsApp was likely blocked in Japan on November 5, 2022 at 10:39:29 PM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders an accessible measurement', () => {
      cy.visit('/m/012020030408e75e07cef9cdfb6e9ea3acebd166')
      cy.heroHasColor(normalColor)
        .contains('OK')
    })

    it('renders an anomaly measurement', () => {
      cy.visit('/m/012020040789cd6d987254bc4e5c273aa9d21bac')
      cy.heroHasColor(anomalyColor)
        .contains('Anomaly')
    })

    // Failed WhatsApp measurements are not styled and presented as failed tests
    // it('renders a failed measurement', () => {
    //   cy.visit('/measurement/20201106T201330Z_whatsapp_BA_20875_n1_l6spr0AGVxYVjr1f')
    //   cy.heroHasColor(errorColor)
    //     .contains('Error')
    // })
  })

  describe('Signal Tests', () => {
    it('renders an accessible measurement', () => {
      cy.visit('/m/20210414233242.034345_BR_signal_390dca674022005a')
      cy.heroHasColor(normalColor)
        .contains('OK')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Signal was reachable in Brazil on April 14, 2021 at 11:32:39 PM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders an anomaly measurement', () => {
      cy.visit('/m/20210415084230.511612_IR_signal_ed269d082953bf2e')
      cy.heroHasColor(anomalyColor)
        .contains('Anomaly')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Signal was NOT reachable in Iran on April 15, 2021 at 8:42:27 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('Facebook Messenger Tests', () => {
    it('renders an accessible measurement', () => {
      cy.visit('/m/01202004070b44da76babb5b2787229c716eb5c0')
      cy.heroHasColor(normalColor)
        .contains('OK')
    })

    it('renders an anomaly measurement', () => {
      cy.visit('/m/01202003044cadd4e9b30806be0e72a6e05e161a')
      cy.heroHasColor(anomalyColor)
        .contains('Anomaly')
    })

    it('renders a reachable og:description', () => {
      cy.visit('/m/20221110104252.671949_US_facebookmessenger_912d2f2d26844b06')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Facebook Messenger was reachable in United States on November 10, 2022 at 10:42:52 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders a unreachable og:description', () => {
      cy.visit('/m/20221110103308.795512_RU_facebookmessenger_32694d11922cf790')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Facebook Messenger was NOT reachable in Russia on November 10, 2022 at 10:32:58 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('HTTP Header Field Manipulation Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/m/01202003051d268f1ae18bb2e1e05894622664e1')
      cy.heroHasColor(normalColor)
        .contains('No middleboxes detected')
    })
    it('render an anomaly measurement', () => {
      cy.visit('/m/0120190530049ab375070fa2186452757fa15d2d')
      cy.heroHasColor(anomalyColor)
        .contains('Network tampering')
    })
    it('renders a valid og:description', () => {
      cy.visit('/m/20221110105736.694076_ES_httpheaderfieldmanipulation_ea459e693b3d42a2')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests HTTP header manipulation was not detected in Spain on November 10, 2022 at 10:57:36 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
    it('renders an anomaly og:description', () => {
      cy.visit('/m/20221110104928.397322_IR_httpheaderfieldmanipulation_33ed804ee27d4955')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests HTTP header manipulation was detected in Iran on November 10, 2022 at 10:49:28 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('HTTP Invalid Request Line Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/m/01202003056c7c5160af23ce0c80f3eff9bc5511')
      cy.heroHasColor(normalColor)
        .contains('No middleboxes detected')
    })
    it('render an anomaly measurement', () => {
      cy.visit('/m/012017021391ee98a6165063d15bc5932992c4cd')
      cy.heroHasColor(anomalyColor)
        .contains('Network tampering')
    })
    it('renders a valid og:description', () => {
      cy.visit('/m/20221110105942.212061_TR_httpinvalidrequestline_f99ce62beb3badb9')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Network traffic manipulation was not detected in Turkey on November 10, 2022 at 10:59:36 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
    it('render an anomaly og:description', () => {
      cy.visit('/m/20221110105947.714767_US_httpinvalidrequestline_48ce6c10181803ab')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Network traffic manipulation was detected in United States on November 10, 2022 at 10:59:45 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('NDT Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/m/012020030575cb7793b78627e4c2603b528788d9')
      cy.heroHasColor(ooniBlue)
        .contains('Results')
    })

    it('renders a failed measurement', () => {
      cy.visit('/m/01201911098a2eebcc7e2987c051a332b7769a57')
      cy.heroHasColor(ooniBlue)
        .contains('Failed')
    })

    it('renders a valid og:description', () => {
      cy.visit('/m/20221110105049.153143_DE_ndt_b15c26280f8b5993')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Speed test result (NDT Test) in Germany on November 10, 2022 at 10:50:28 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('DASH Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/m/0120200305edf12004fc77609526ea1dab7242a2')
      cy.heroHasColor(ooniBlue)
        .contains('Results')
    })
    it('renders a failed measurement', () => {
      cy.visit('/m/0120190930e8f3eb8e075af3ffe8e54f33caeae2')
      cy.heroHasColor(errorColor)
        .contains('Error')
    })
    it('renders a valid og:description', () => {
      cy.visit('/m/20221110111106.870773_US_dash_2d879e766e4a5bde')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests 2160p (4k) quality video streaming at 539.09 Mbit/s speed in United States on November 10, 2022 at 11:11:04 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('Psiphon Tests', () => {
    it('renders an accessible measurement', () => {
      cy.visit('/m/20201203230549.305242_US_psiphon_679c286b94dcd8dd')
      cy.heroHasColor(normalColor)
        .contains('Psiphon works')
    })
    it('renders an anomaly measurement', () => {
      cy.visit('/m/20201203083035.979967_HK_psiphon_6cdafc0b20693ffb')
      cy.heroHasColor(anomalyColor)
        .contains('Psiphon is likely blocked')
    })
    it('renders a reachable og:description', () => {
      cy.visit('/m/20221110112249.613770_US_psiphon_58f1cff53798e088')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Psiphon was reachable in United States on November 10, 2022 at 11:22:43 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('Tor Tests', () => {
    it('renders an accessible measurement', () => {
      cy.visit('/m/01202003048e012a0f33e47499995467d758ddd8')
      cy.heroHasColor(normalColor)
        .contains('Tor works')
    })
    it('renders an anomaly measurement', () => {
      cy.visit('/m/20201203023552.701125_CN_tor_5968b910a2f8e92c')
      cy.heroHasColor(anomalyColor)
        .contains('Tor is likely blocked')
    })
    it('renders a valid og:description', () => {
      cy.visit('/m/20221110112405.003769_US_tor_56e03d764ee82e8f')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Tor censorship test result in United States on November 10, 2022 at 11:23:02 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('Invalid Measurements', () => {
    it('URL with invalid measurement_uid says measurement was not found', () => {
      const reportIdNotInDB = 'this-measurement-does-not-exist'
      cy.visit(`/m/${reportIdNotInDB}`)
      cy.get('h4').contains('Measurement not found')
        .siblings('div').contains(reportIdNotInDB)
    })

    it('Missing measurement_uid in URL says the page cannot be found', () => {
      cy.visit('/m/', {failOnStatusCode: false}) // bypasss 4xx errors
      cy.get('h4').contains('The requested page does not exist')
    })
  })

  describe('User Feedback', () => {
    before(() => {
      cy.clearLocalStorage()
    })

    it('can login', () => {
      cy.interceptRequest(failedAccountMetadata)

      const measurementUrl = '/m/20230307142542.625294_US_webconnectivity_9215f30cf2412f49'
      cy.visit(measurementUrl)
      cy.findByText('VERIFY').click()

      cy.findByRole('textbox').click().type('randomEmail@randomEmail.com')
      cy.findByText('Login').click()
      cy.findByText('Login link sent')
    })


    it('can submit feedback', () => {
      const measurementUrl = '/m/20230307142542.625294_US_webconnectivity_9215f30cf2412f49'

      cy.visit(measurementUrl)
      cy.findByText('VERIFY').click()

      cy.get('body').then(($body) => {
        if ($body.text().includes('Your previous feedback')) {
          cy.findByText('Edit').click()
        }
      })

      cy.get('form').findByText('It\'s blocked').click()
      cy.get('form').findByText('Block page').click()
      cy.get('form').findByText('CAPTCHA').click()
      cy.get('form').findByText('Submit').click()
      
      cy.findByText('Thank you!')
    })
  })
})
