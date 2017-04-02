const express = require('express')
const path = require('path')
const next = require('next')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'
const isDev = process.env.NODE_ENV === 'development'
process.env.PORT = process.env.PORT || isDev ? 3000 : 80

const app = next({ dir: '.', dev: isDev })
const handle = app.getRequestHandler()

const server = express()

app.prepare()
  .then(() => {
    return new Promise((resolve, reject) => {
      // XXX in here I can do setup
      return resolve()
    })
  })
  .then(() => {

    server.use('/_/world-atlas',
               express.static(__dirname + '/node_modules/world-atlas/world/'))
    server.use('/_/data',
               express.static(__dirname + '/data/'))

    server.get('/country/:name', (req, res) => {
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
