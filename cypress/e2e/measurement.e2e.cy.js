describe('Measurement Page Tests', () => {

  const normalColor = 'rgb(47, 158, 68)'
  const anomalyColor = 'rgb(230, 119, 0)'
  const confirmedColor = 'rgb(240, 62, 62)'
  const errorColor = 'rgb(134, 142, 150)'
  const ooniBlue = 'rgb(5, 136, 203)'

  describe('Web Connectivity tests', () => {
    it('renders a valid accessible og:description', () => {
      cy.visit('/measurement/20221110T100756Z_webconnectivity_US_13335_n1_KWJqHUAPqMdtf2Up?input=https%3A%2F%2Fwww.theguardian.com%2F')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests www.theguardian.com was accessible in United States on November 10, 2022, 10:09:16 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders a valid blocked og:description', () => {
      cy.visit('/measurement/20211215T052819Z_webconnectivity_RU_8369_n1_PkPgEYV2DrBAfPxu?input=http%3A%2F%2Frutor.org')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests rutor.org was blocked in Russia on December 15, 2021, 5:44:55 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders a valid anomaly og:description', () => {
      cy.visit('/measurement/20221110T082316Z_webconnectivity_MY_4788_n1_Ue0y9OwyBLvoIfgm?input=http%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dlesbian')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests www.google.com was accessible in Malaysia on November 10, 2022, 10:25:51 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    // it('renders a valid website down og:description', () => {
    //   cy.visit('')
    //   cy.get('head meta[property="og:description"]')
    //     .should('have.attr', 'content', '')
    // })

    it('an accessible measurement is green and says "OK"', () => {
      cy.visit('/measurement/20200302T211741Z_AS15751_NUQUoAz71ZjhsimkNDy53r62AlfjEWUtoQRag9tnRM0oxZtoWl?input=http%3A%2F%2Fprachatai.com')
      cy.heroHasColor(normalColor)
        .contains('OK')
    })

    it('an anomaly measurement is orange and says "Anomaly"', () => {
      cy.visit('/measurement/20200303T073101Z_AS6830_ritWNm1FDBJJCm0SzcLhucF1wrRJM5zQVVssPXwxhwRitw949v?input=http%3A%2F%2Fwww.efindlove.com%2F')
      cy.heroHasColor(anomalyColor)
        .contains('Anomaly')
    })

    it('a blocked measurement is red and says "Blocked"', () => {
      cy.visit('/measurement/20200303T085244Z_AS42668_UThI3Fdoo0IZ6610604dd0CGkhd7oQV6QLWWzZDVLJ35oGxBO4?input=http%3A%2F%2Frutor.org%2F')
      cy.heroHasColor(confirmedColor)
        .contains('Blocked')
    })

    it('shows that the website measurement was for a down site', () => {
      cy.visit('/measurement/20201029T041242Z_webconnectivity_RU_51604_n1_I0rABGogC4OLATJx?input=http%3A%2F%2Fwww.pokerroom.com%2F')
      cy.heroHasColor(errorColor)
        .contains('Website Down')
    })

    it('renders a failed measurement', () => {
      cy.visit('/measurement/20191118T063541Z_AS15802_ocKS0RbSg8GE1oLahQKYeAozvsxM3HglG8f3xMRkrWVOd4ajtN?input=http%3A%2F%2Fthepiratebay.org%2F')
      cy.heroHasColor(errorColor)
        .contains('Error')
    })

    it('renders a measurement with missing data in test_keys', () => {
      cy.visit('/measurement/20210128T090057Z_webconnectivity_IT_30722_n1_WOS6jGJBP1UMopM9?input=http%3A%2F%2Fvoice.yahoo.jajah.com%2F')
    })
  })

  describe('Telegram Tests', () => {
    it('renders a reachable og:description', () => {
      cy.visit('/measurement/20221110T102855Z_telegram_US_7018_n1_HKJ2sF9m0lP7JMsW')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Telegram was reachable in United States on November 10, 2022, 10:28:56 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders a unreachable og:description', () => {
      cy.visit('measurement/20221109T225726Z_telegram_RU_8402_n1_qnYloXASGMUg2G9O')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Telegram was NOT reachable in Russia on November 9, 2022, 10:57:59 PM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders an accessible measurement', () => {
      cy.visit('/measurement/20200304T195916Z_AS266124_UpLURJOzEXr2S6YmH4aecNYWt40TkcFatX25Xu8dKOtTnkaiZt')
      cy.heroHasColor(normalColor)
        .contains('OK')
    })

    it('renders an anomaly measurement', () => {
      cy.visit('measurement/20221109T225726Z_telegram_RU_8402_n1_qnYloXASGMUg2G9O')
      cy.heroHasColor(anomalyColor)
        .contains('Anomaly')
    })
  })

  describe('WhatsApp Tests', () => {
    it('renders a reachable og:description', () => {
      cy.visit('/measurement/20221110T103853Z_whatsapp_US_7922_n1_JPLapx8JfJ0J4nf4')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests WhatsApp was reachable in United States on November 10, 2022, 10:38:53 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders an unreachable og:description', () => {
      cy.visit('/measurement/20221105T223928Z_whatsapp_JP_55392_n1_aL6HH9GHYc1YbILm')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests WhatsApp was likely blocked in Japan on November 5, 2022, 10:39:29 PM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders an accessible measurement', () => {
      cy.visit('/measurement/20200304T203936Z_AS44869_bVdV4B2HXylbIS8nFmdYbXDsDa5gwmkJbF38uWEfus1MMpS5b6')
      cy.heroHasColor(normalColor)
        .contains('OK')
    })

    it('renders an anomaly measurement', () => {
      cy.visit('/measurement/20200407T024309Z_AS4713_xA9Wh81DQrIFqRe46zwKeyJw4DJQwjyTLBIi2zSQqWUBsfQMJS')
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
      cy.visit('/measurement/20210414T233239Z_signal_BR_271354_n1_zCvPVXKJT7kxPQI4')
      cy.heroHasColor(normalColor)
        .contains('OK')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Signal was reachable in Brazil on April 14, 2021, 11:32:39 PM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders an anomaly measurement', () => {
      cy.visit('/measurement/20210415T084229Z_signal_IR_43754_n1_Jxzkc6sOLFBybUZN')
      cy.heroHasColor(anomalyColor)
        .contains('Anomaly')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Signal was NOT reachable in Iran on April 15, 2021, 8:42:27 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('Facebook Messenger Tests', () => {
    it('renders an accessible measurement', () => {
      cy.visit('/measurement/20200407T235214Z_AS3269_EIlT6478yDwpzYNO8f54Xl12aN4AbkK82OuCUZSYHh3cTKNoYF')
      cy.heroHasColor(normalColor)
        .contains('OK')
    })

    it('renders an anomaly measurement', () => {
      cy.visit('/measurement/20200304T191012Z_AS42610_fqDY31xiRoWEdKd4GWtV84UYpXG2RlpjBK7kd8rTLHIItqMnej')
      cy.heroHasColor(anomalyColor)
        .contains('Anomaly')
    })

    it('renders a reachable og:description', () => {
      cy.visit('/measurement/20221110T104252Z_facebookmessenger_US_20115_n1_o61hepYQFOp1mtT9')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Facebook Messenger was reachable in United States on November 10, 2022, 10:42:52 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })

    it('renders a unreachable og:description', () => {
      cy.visit('/measurement/20221110T103257Z_facebookmessenger_RU_12389_n1_I1KmLISJCV1o4EoV')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Facebook Messenger was NOT reachable in Russia on November 10, 2022, 10:32:58 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('HTTP Header Field Manipulation Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/measurement/20200305T111851Z_AS4788_amSrLB7KzNBXHtr7RKpRS5GLn67yffsQEMn55r827ZY37GYKME')
      cy.heroHasColor(normalColor)
        .contains('No middleboxes detected')
    })
    it('render an anomaly measurement', () => {
      cy.visit('/measurement/20190530T141520Z_AS4788_DNqCUqL7CAfijExowyaymigb2sITdpS47gjrieDJCx8kDc1TfO')
      cy.heroHasColor(anomalyColor)
        .contains('Network tampering')
    })
    it('renders a valid og:description', () => {
      cy.visit('/measurement/20221110T105736Z_httpheaderfieldmanipulation_ES_57269_n1_8SnGox89HKlVQoDJ')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests HTTP header manipulation was not detected in Spain on November 10, 2022, 10:57:36 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
    it('renders an anomaly og:description', () => {
      cy.visit('/measurement/20221110T104927Z_httpheaderfieldmanipulation_IR_58224_n1_voFn4ODgxZHJCpoy')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests HTTP header manipulation was detected in Iran on November 10, 2022, 10:49:28 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('HTTP Invalid Request Line Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/measurement/20200305T111845Z_AS4788_zqXWDSwyywderTJvq2pNb8SnN4WnED1auwBTXoUhi7z9orRLAm')
      cy.heroHasColor(normalColor)
        .contains('No middleboxes detected')
    })
    it('render an anomaly measurement', () => {
      cy.visit('/measurement/20170213T160709Z_AS8452_M5qSjOZgYwFrkQYVfdrYmYw2tLc3dzJB7mVbtjVoR1qCdbcEOA')
      cy.heroHasColor(anomalyColor)
        .contains('Network tampering')
    })
    it('renders a valid og:description', () => {
      cy.visit('/measurement/20221110T105936Z_httpinvalidrequestline_TR_47331_n1_fB1HONVuo6bJAcbz')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Network traffic manipulation was not detected in Turkey on November 10, 2022, 10:59:36 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
    it('render an anomaly og:description', () => {
      cy.visit('/measurement/20221110T105942Z_httpinvalidrequestline_US_13335_n1_cwbvshRglfEgMGAF')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Network traffic manipulation was detected in United States on November 10, 2022, 10:59:45 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('NDT Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/measurement/20200305T112156Z_AS26599_aSpBFd7r2FtEupc8I5sndPSy6B3TmWR2N2BtgPIHtL48kx0r56')
      cy.heroHasColor(ooniBlue)
        .contains('Results')
    })

    it('renders a failed measurement', () => {
      cy.visit('/measurement/20191109T103749Z_AS15802_pZVgEw2WzmXRnDfw1sGN9tTnIO8iKiQHNWZW7XzPZqsEWsbkAu')
      cy.heroHasColor(ooniBlue)
        .contains('Failed')
    })

    it('renders a valid og:description', () => {
      cy.visit('/measurement/20221110T105028Z_ndt_DE_3209_n1_9eyIJwUdcD6u3WgC')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Speed test result (NDT Test) in Germany on November 10, 2022, 10:50:28 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('DASH Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/measurement/20200305T111858Z_AS30722_nVhzJRyaFoOInIhKLVuBHVTfSUplclWYaUO47pwOgq1CleV2CO')
      cy.heroHasColor(ooniBlue)
        .contains('Results')
    })
    it('renders a failed measurement', () => {
      cy.visit('/measurement/20190930T212715Z_AS17380_2W4uXDAWAckWTGI5TRep5hw5j5gSS31wKlbO2RHlV0v4fudSXW')
      cy.heroHasColor(errorColor)
        .contains('Error')
    })
    it('renders a valid og:description', () => {
      cy.visit('/measurement/20221110T111104Z_dash_US_19969_n1_kyclVb6Fj9VuW3A9')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests 2160p (4k) quality video streaming at 539.09 Mbit/s speed in United States on November 10, 2022, 11:11:04 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('Psiphon Tests', () => {
    it('renders an accessible measurement', () => {
      cy.visit('/measurement/20201203T234857Z_psiphon_US_7922_n1_o3EQXofRAStZ6bpV')
      cy.heroHasColor(normalColor)
        .contains('Psiphon works')
    })
    it('renders an anomaly measurement', () => {
      cy.visit('/measurement/20201203T083430Z_psiphon_HK_58453_n1_uKomfZwdUoeRHefK')
      cy.heroHasColor(anomalyColor)
        .contains('Psiphon is likely blocked')
    })
    it('renders a reachable og:description', () => {
      cy.visit('/measurement/20221110T112242Z_psiphon_US_7018_n1_clM85Z0Pof3RqXdp')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Psiphon was reachable in United States on November 10, 2022, 11:22:43 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('Tor Tests', () => {
    it('renders an accessible measurement', () => {
      cy.visit('/measurement/20200304T185533Z_AS30722_H9in1I9RdujJM8lLfCz01SXDoKFRvvdeb519BpHzGk2uYUArkx')
      cy.heroHasColor(normalColor)
        .contains('Tor works')
    })
    it('renders an anomaly measurement', () => {
      cy.visit('/measurement/20201203T024400Z_tor_CN_4134_n1_XtHDEW5iIBzbErYo')
      cy.heroHasColor(anomalyColor)
        .contains('Tor is likely blocked')
    })
    it('renders a valid og:description', () => {
      cy.visit('/measurement/20221110T112301Z_tor_US_7018_n1_uszAjDiPyoWLMyuV')
      cy.get('head meta[property="og:description"]')
        .should('have.attr', 'content', 'OONI data suggests Tor censorship test result in United States on November 10, 2022, 11:23:02 AM UTC, find more open data on internet censorship on OONI Explorer.')
    })
  })

  describe('Invalid Measurements', () => {
    it('URL with invalid report_id says measurement was not found', () => {
      const reportIdNotInDB = 'this-measurement-does-not-exist'
      cy.visit(`/measurement/${reportIdNotInDB}`)
      cy.get('h4').contains('Measurement Not Found')
        .siblings('div').contains(reportIdNotInDB)
    })

    it('Missing report_id in URL says the page cannot be found', () => {
      cy.visit('/measurement/', {failOnStatusCode: false}) // bypasss 4xx errors
      cy.get('h4').contains('Measurement Not Found')
    })
  })

})
