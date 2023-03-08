const nodemailer = require('nodemailer')
const imaps = require('imap-simple')
const simpleParser = require('mailparser').simpleParser
const { JSDOM } = require('jsdom')

const makeEmailAccount = async () => {
  // Generate a new Ethereal email inbox account
  const testAccount = await nodemailer.createTestAccount()

  const emailConfig = {
    imap: {
      user: testAccount.user,
      password: testAccount.pass,
      host: 'imap.ethereal.email',
      port: 993,
      tls: true,
      authTimeout: 10000,
    },
  }
  console.log('created new email account %s', testAccount.user)
  console.log('the password is %s', testAccount.pass)

  const userEmail = {
    email: testAccount.user,

    async getLastEmail() {
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
    },
  }

  return userEmail
}

module.exports = makeEmailAccount

