/* global describe, it, cy, before */
describe('Measurement Page Tests', () => {

  const normalColor = 'rgb(47, 158, 68)'
  const anomalyColor = 'rgb(230, 119, 0)'
  const confirmedColor = 'rgb(240, 62, 62)'

  describe('Web Connectivity tests', () => {
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
  })

  describe('Telegram Tests', () => {
    it('renders an accessible measurement', () => {
      cy.visit('/measurement/20200304T195916Z_AS266124_UpLURJOzEXr2S6YmH4aecNYWt40TkcFatX25Xu8dKOtTnkaiZt')
    })

    it('renders an anomaly measurement', () => {
      cy.visit('/measurement/20200304T183801Z_AS42610_uehNyFJgkAJBCaq5thzAovFEODIQ1u5vlTTk3D6GDvbaYeoJY8')
    })
  })

  describe('WhatsApp Tests', () => {
    it('renders an accessible measurement', () => {
      cy.visit('/measurement/20200304T203936Z_AS44869_bVdV4B2HXylbIS8nFmdYbXDsDa5gwmkJbF38uWEfus1MMpS5b6')
    })

    it('renders an anomaly measurement', () => {
      cy.visit('/measurement/20200407T024309Z_AS4713_xA9Wh81DQrIFqRe46zwKeyJw4DJQwjyTLBIi2zSQqWUBsfQMJS')
    })
  })

  describe('Facebook Messenger Tests', () => {
    it('renders an accessible measurement', () => {
      cy.visit('/measurement/20200407T235214Z_AS3269_EIlT6478yDwpzYNO8f54Xl12aN4AbkK82OuCUZSYHh3cTKNoYF')
    })

    it('renders an anomaly measurement', () => {
      cy.visit('/measurement/20200304T191012Z_AS42610_fqDY31xiRoWEdKd4GWtV84UYpXG2RlpjBK7kd8rTLHIItqMnej')
    })
  })

  describe('HTTP Header Field Manipulation Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/measurement/20200305T111851Z_AS4788_amSrLB7KzNBXHtr7RKpRS5GLn67yffsQEMn55r827ZY37GYKME')
    })
  })

  describe('HTTP Invalid Request Line Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/measurement/20200305T111845Z_AS4788_zqXWDSwyywderTJvq2pNb8SnN4WnED1auwBTXoUhi7z9orRLAm')
    })
  })

  describe('NDT Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/measurement/20200305T112156Z_AS26599_aSpBFd7r2FtEupc8I5sndPSy6B3TmWR2N2BtgPIHtL48kx0r56')
    })
  })

  describe('DASH Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/measurement/20200305T111858Z_AS30722_nVhzJRyaFoOInIhKLVuBHVTfSUplclWYaUO47pwOgq1CleV2CO')
    })
  })

  describe('Psiphon Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/measurement/20200304T195627Z_AS30722_Swo4rmIOhNco9zQlX1qf421E6xgMzf5QZeP6oExHWmNOlsUNsO')
    })
  })

  describe('Tor Tests', () => {
    it('renders a valid measurement', () => {
      cy.visit('/measurement/20200304T185533Z_AS30722_H9in1I9RdujJM8lLfCz01SXDoKFRvvdeb519BpHzGk2uYUArkx')
    })
  })

  describe('Invalid Measurements', () => {
    it('URL with invalid report_id says measurement was not found', () => {
      const reportIdNotInDB = 'this-measurement-does-not-exist'
      cy.visit(`/measurement/${reportIdNotInDB}`)
      cy.get('h4').contains('Measurement Not Found')
        .siblings('p').contains(reportIdNotInDB)
    })

    it('Missing report_id in URL says the page cannot be found', () => {
      cy.visit('/measurement/', {failOnStatusCode: false}) // bypasss 4xx errors
      cy.get('h4').contains('The requested page does not exist')
    })
  })

})
