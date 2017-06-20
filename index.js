const express = require('express')
const next = require('next')
const path = require('path')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.PORT = process.env.PORT || 3100

const dev = process.env.NODE_ENV !== 'production'
if (dev === true) {
  process.env.MEASUREMENTS_URL = process.env.MEASUREMENTS_URL || "http://127.0.0.1:3000"
}

const app = next({ dir: '.', dev })
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
	server.use('/_/static',
						 express.static(__dirname + '/static/'))

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
});
