/* eslint-disable no-console */
/* global require */
const glob = require('glob')
const { basename, resolve } = require('path')
// const csvParse = require('csv-parse/lib/sync')
const { readFileSync, writeFileSync } = require('fs')

const LANG_DIR = './static/lang/'
const DEFAULT_LOCALE = 'en'

const defaultMessages = glob.sync(`${LANG_DIR}.messages/**/*.json`)
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

// Adapted from https://gist.github.com/arnaudriegert/0ce380f3e5cb39faec8c0d96b2b43b9c
const emptyMessages = glob.sync(`${LANG_DIR}.messages/**/*.json`)
  .map((filename) => readFileSync(filename, 'utf8'))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({id}) => {
      if (collection.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`)
      }
      collection[id] = ''
    })
    return collection
  }, {})

const updateDict = (original, update) => {
  const originalKeys = Object.keys(original)
  const updateKeys = Object.keys(update)
  const updated = {...original}
  originalKeys.forEach((key) => {
    if (updateKeys.indexOf(key) === -1) {
      delete updated[key]
    }
  })
  updateKeys.forEach((key) => {
    if (originalKeys.indexOf(key) === -1) {
      updated[key] = update[key]
    }
  })
  return updated
}

const additionalLanguages = glob.sync(`${LANG_DIR}*.json`).map((filename) => {
  const findLocale = filename.match(new RegExp(`${LANG_DIR}(.*).json`))
  return findLocale ? findLocale[1] : null
}).filter((locale) => locale !== DEFAULT_LOCALE)

additionalLanguages.forEach((locale) => {
  const filename = `${LANG_DIR}${locale}.json`
  let original
  try {
    original = JSON.parse(readFileSync(filename))
    const updatedMessages = updateDict(original, emptyMessages)
    writeFileSync(filename, JSON.stringify(updatedMessages, null, 2))
    console.log(`> Updated translations for locale ${locale}.`)
    console.info('>> New keys were initialized with empty strings as values and obsolete keys were removed.')
  } catch (err) {
    console.error(`> Couldn't update translations for locale ${locale}: invalid JSON.`)
    console.info('>> Check the file for an error or reset it by setting its content to an empty object: {}')
  }
})

// Build the locale files to be sent to the browser
const translationsMap = supportedLanguages
  .reduce((t, lang) => {
    t[lang] = JSON.parse(readFileSync(`./static/lang/${lang}.json`))
    return t
  }, {})

const translationsContent = `window.OONITranslations = ${JSON.stringify(translationsMap)}`
writeFileSync('./static/lang/translations.js', translationsContent)
console.log('> Wrote translations to: ./static/lang/translations.js')
