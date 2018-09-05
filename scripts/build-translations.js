/* global require */
const glob = require('glob')
const { basename, resolve } = require('path')
// const csvParse = require('csv-parse/lib/sync')
const { readFileSync, writeFileSync } = require('fs')

const defaultMessages = glob.sync('./static/lang/.messages/**/*.json')
  .map((filename) => readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((messages, descriptors) => {
    descriptors.forEach(({id, defaultMessage}) => {
      if (messages.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`)
      }
      messages[id] = defaultMessage
    })
    return messages
  }, {})

writeFileSync('./static/lang/en.json', JSON.stringify(defaultMessages, null, 2))
console.log(`> Wrote default messages to: "${resolve('./static/lang/en.json')}"`)

const supportedLanguages = glob.sync('./static/lang/*.json').map((f) => basename(f, '.json'))
const localeDataFilesContent = supportedLanguages
  .map(lang => require.resolve(`react-intl/locale-data/${lang}`))
  .map(path => readFileSync(path, 'utf8'))

writeFileSync('./static/locale-data.js', localeDataFilesContent.join('\n'))
console.log('> Wrote locale-data to: ./static/locale-data.js')

const translationsMap = supportedLanguages
  .reduce((t, lang) => {
    t[lang] = JSON.parse(readFileSync(`./static/lang/${lang}.json`))
    return t
  }, {})

const translationsContent = `window.OONITranslations = ${JSON.stringify(translationsMap)}`
writeFileSync('./static/lang/translations.js', translationsContent)
console.log('> Wrote translations to: ./static/lang/translations.js')
