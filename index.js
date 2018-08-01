/* global require, process, __dirname */
/* eslint no-console: off */
const express = require('express')
const next = require('next')
const axios = require('axios')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.PORT = process.env.PORT || 3100

const dev = process.env.NODE_ENV === 'development'
if (dev === true) {
  process.env.MEASUREMENTS_URL = process.env.MEASUREMENTS_URL || 'http://127.0.0.1:' + process.env.PORT
} else {
  process.env.MEASUREMENTS_URL = process.env.MEASUREMENTS_URL || 'https://api.ooni.io'
}
if (!process.env.EXPLORER_URL) {
  process.env.EXPLORER_URL = 'http://127.0.0.1:' + process.env.PORT
}

const app = next({ dir: '.', dev })
const handle = app.getRequestHandler()

const s3BaseURL = 'https://s3.us-east-2.amazonaws.com/ooni-explorer/static/'
const s3Client = axios.create({
  baseURL: s3BaseURL
})

const server = express()

app.prepare()
  .then(() => {
    return new Promise((resolve) => {
    // XXX in here I can do setup
      return resolve()
    })
  })
  .then(() => {

    server.use('/_/world-atlas',
      express.static(__dirname + '/node_modules/world-atlas/world/'))
    server.use('/_/data',
      express.static(__dirname + '/data/'))

    // We add this endpoint so that we can do caching of s3 requests
    server.get('/_/s3/:staticPath', (req, res) => {
      s3Client.get(req.params.staticPath)
        .then(response => {
          res.json(response.data)
        })
        .catch(err => {
          console.error(err)
          res.status(500).json({'error': 'invalid request'})
        })
    })

    server.get('/country/:countryCode', (req, res) => {
      return app.render(req, res, '/country', req.params)
    })

    // Default catch all
    server.all('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(process.env.PORT, err => {
      if (err) {
        throw err
      }
      console.log('> Ready on http://localhost:' +
    process.env.PORT +
    ' [' + process.env.NODE_ENV + ']')
    })
  })
  .catch(err => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
  })
