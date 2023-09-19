import { rest } from 'msw'
 
const apiBase = Cypress.env('apiUrl')

export const handlers = [
  rest.get(`${apiBase}/api/_/account_metadata`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        logged_in: true,
        role: 'admin',
      }),
    )
  }),

  rest.post(`${apiBase}/api/v1/user_register`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        role: 'admin',
      }),
    )
  }),

  rest.get(`${apiBase}/api/v1/user_login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        bearer: 'abc123',
        redirect_to: 'https://explorer.org/'
      }),
    )
  }),

  rest.post(`${apiBase}/api/_/measurement_feedback`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
      }),
    )
  }),
]

export const failedAccountMetadata = rest.get('https://ams-pg-test.ooni.org/api/_/account_metadata', (req, res, ctx) => {
    return res(
      ctx.status(401),
    )
  })
