/* eslint-disable no-console */
const glob = require('glob')
const { dirname, basename, resolve } = require('path')
const { readFileSync, writeFileSync } = require('fs')

const LANG_DIR = './public/static/lang/'
const TRANSLATED_STRINGS_DIR = '../translations/explorer'

const supportedLanguages = glob
  .sync(`${TRANSLATED_STRINGS_DIR}/**/*.json`)
  .map((f) => basename(dirname(f, '.json')))

// Copy latest files from `translations`
supportedLanguages.forEach((lang) => {
  console.log('> Getting latest translations for:', lang)
  const formattedLang = lang.replace('_', '-')
  writeFileSync(
    `${LANG_DIR}/${formattedLang}.json`,
    readFileSync(`${TRANSLATED_STRINGS_DIR}/${lang}/strings.json`)
  )
})

// Build the locale files to be sent to the browser
// const translationsMap = supportedLanguages.reduce((t, lang) => {
//   const formattedLang = lang.replace('_', '-')
//   t[formattedLang] = JSON.parse(
//     readFileSync(`${LANG_DIR}/${formattedLang}.json`)
//   )
//   return t
// }, {})

// const translationsContent = `window.OONITranslations = ${JSON.stringify(
//   translationsMap
// )}`
// writeFileSync(`${LANG_DIR}/translations.js`, translationsContent)
// console.log(`> Wrote translations to: ${LANG_DIR}/translations.js`)
