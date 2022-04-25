/* eslint-disable no-console */
const glob = require('glob')
const { basename } = require('path')
const { readFileSync, writeFileSync } = require('fs')

const LANG_DIR = './public/static/lang/'
const TRANSLATED_STRINGS_DIR = '../translations/explorer'

const supportedLanguages = glob.sync(`${TRANSLATED_STRINGS_DIR}/*`).map((f) => basename(f, '.json'))

// Copy latest files from `translations`
supportedLanguages.forEach((lang) => {
  console.log('> Getting latest translations for:', lang)
  writeFileSync(`${LANG_DIR}/${lang}.json`, readFileSync(`${TRANSLATED_STRINGS_DIR}/${lang}/strings.json`))
})

// Build the locale files to be sent to the browser
const translationsMap = supportedLanguages
  .reduce((t, lang) => {
    t[lang] = JSON.parse(readFileSync(`${LANG_DIR}/${lang}.json`))
    return t
  }, {})

const translationsContent = `window.OONITranslations = ${JSON.stringify(translationsMap)}`
writeFileSync(`${LANG_DIR}/translations.js`, translationsContent)
console.log(`> Wrote translations to: ${LANG_DIR}/translations.js`)
