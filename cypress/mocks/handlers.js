/* global process */
import { rest } from 'msw'
import fixtures from '../fixtures'

export const handlers = [
  rest.get(`${process.env.MEASUREMENTS_URL}/api/v1/measurements`, (req, res, ctx) => {
    // URL used by percy test case
    // /search?until=2020-12-06&since=2020-12-15
    if (req.url.searchParams.get('since') === '2020-12-06'
      && req.url.searchParams.get('until') === '2020-12-15'
    ) {
      const { part1, part2 } = req.params
      if (`/api/${part1}/${part2}` in fixtures) {
        return res(
          ctx.json(fixtures[`/api/${part1}/${part2}`])
        )
      }
    } else {
      return
    }
  }),
  // generic handler for all API calls
  // rest.get(`${process.env.MEASUREMENTS_URL}/api/:part1/:part2`, (req, res, ctx) => {
  //   const { part1, part2 } = req.params
  //   if (`/api/${part1}/${part2}` in fixtures) {
  //     return res(
  //       ctx.json(fixtures[`/api/${part1}/${part2}`])
  //     )
  //   }
  // })
]
