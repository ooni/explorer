const imaps = require('imap-simple')
const simpleParser = require('mailparser').simpleParser
const { JSDOM } = require('jsdom')

// TODO either move to env vars or create a new account before each test run programatically
const emailAddress = 'kaylee.greenholt48@ethereal.email'
const emailConfig = {
  imap: {
    user: emailAddress,
    password: 'xgkQh19Fc11TGskEER',
    host: 'imap.ethereal.email',
    port: 993,
    tls: true,
    authTimeout: 10000,
  },
}

const emailAccount = {
  emailAddress,
  // Utility method for getting the last email
  // for the Ethereal email
  getLastEmail: async () => {
    try {
      const connection = await imaps.connect(emailConfig)

      await connection.openBox('INBOX')
      const searchCriteria = ['1:50']
      const fetchOptions = {
        bodies: [''],
      }
      const messages = await connection.search(searchCriteria, fetchOptions)
      connection.end()

      if (!messages.length) {
        console.log('cannot find any emails')
        return null
      } else {
        console.log('there are %d messages', messages.length)
        // get the last email
        const mail = await simpleParser(
          messages[messages.length - 1].parts[0].body,
        )

        const dom = new JSDOM(mail.html)
        const link = dom.window.document.querySelector('a').href
        const url = new URL(link)
        const path = url.pathname + url.search

        return {
          loginLink: path
        }
        return {}
      }
    } catch (e) {
      console.error(e)
      return null
    }
  }
}


module.exports = emailAccount


