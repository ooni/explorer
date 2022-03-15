/* global require, __dirname */
/* eslint no-console: off */
const fs = require('fs')
const path = require('path')
const Mustache = require('mustache')


const SVGCountryFlagsDir = path.join(
  __dirname,
  '..',
  'node_modules',
  'flag-icon-css',
  'flags',
  '1x1'
)

const main = () => {
  fs.readdir(SVGCountryFlagsDir, (err, files) => {
    fs.readFile('scripts/templates/FlagCC.js.tmpl', 'utf8', (err, tmpl) => {
      files.forEach((file) => {
        const alpha2 = file.split('.svg')[0]
        if (alpha2.length !== 2) {
          return
        }
        const alpha2Upper = alpha2.toUpperCase()
        const jsContent = Mustache.render(tmpl, {alpha2, alpha2Upper})
        const dstPath = path.join(__dirname, '..', 'components', 'flags', `${alpha2}.js`)
        fs.writeFile(dstPath, jsContent, (err) => {
          // if (err) {
          //   console.log('Failed to write ' + dstPath, err)
          // }
          return
        })
      })
    })
  })
}

main()
