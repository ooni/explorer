import { http } from 'msw'

const apiBase = Cypress.env('apiUrl')

export const handlers = [
  http.get(`${apiBase}/api/_/account_metadata`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        logged_in: true,
        role: 'admin',
      }),
    )
  }),

  http.post(`${apiBase}/api/v1/user_register`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        role: 'admin',
      }),
    )
  }),

  http.get(`${apiBase}/api/v1/user_login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        bearer: 'abc123',
        redirect_to: 'https://explorer.org/',
      }),
    )
  }),

  http.post(`${apiBase}/api/_/measurement_feedback`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}))
  }),
]

export const failedAccountMetadata = http.get(
  'https://backend-hel.ooni.org/api/_/account_metadata',
  (req, res, ctx) => {
    return res(ctx.status(401))
  },
)

export const userAccountMetadata = http.get(
  'https://backend-hel.ooni.org/api/_/account_metadata',
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        logged_in: true,
        role: 'user',
      }),
    )
  },
)
