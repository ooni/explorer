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
    descriptors.forEach(({ id }) => {
      if (messages.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`)
      }
      messages.push({ 'Key': id, 'Text': '' })
    })
    return messages
  }, [])

writeFileSync('./static/lang/en.csv', JSON.stringify(defaultMessages, null, 2))
console.log(`> Wrote default messages to: "${resolve('./static/lang/en.csv')}"`)
