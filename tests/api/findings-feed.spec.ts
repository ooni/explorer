import { expect, test } from '@playwright/test'
import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import handler from '../../pages/api/findings-rss'
import { createFindingsFeed } from '../../lib/findingsFeed'

const published = {
  id: 1234,
  slug: 'censorship-finding',
  published: true,
  title: 'Blocking & interference <example>',
  short_description: 'A "quoted" description & details\u0001',
  create_time: '2023-09-14T10:59:31Z',
  reported_by: 'not included',
}

const listen = async (server: Server) => {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`
}
const close = (server: Server) =>
  new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  )

test.describe('public findings RSS', () => {
  test.describe.configure({ mode: 'serial' })
  let upstream: Server
  let feedServer: Server
  let feedUrl: string
  let upstreamStatus = 200
  let upstreamBody: unknown
  let upstreamRequests: {
    url?: string
    cookie?: string
    authorization?: string
  }[]
  let previousApi: string | undefined
  let previousExplorer: string | undefined

  test.beforeAll(async () => {
    previousApi = process.env.NEXT_PUBLIC_USER_FEEDBACK_API
    previousExplorer = process.env.NEXT_PUBLIC_EXPLORER_URL
    upstream = createServer((req, res) => {
      upstreamRequests.push({
        url: req.url,
        cookie: req.headers.cookie,
        authorization: req.headers.authorization,
      })
      res.writeHead(upstreamStatus, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(upstreamBody))
    })
    process.env.NEXT_PUBLIC_USER_FEEDBACK_API = await listen(upstream)
    process.env.NEXT_PUBLIC_EXPLORER_URL = 'https://explorer.example'
    // Exercise the actual Next API handler and its server-side fetch over HTTP.
    feedServer = createServer((req, res) => {
      void handler(req, res)
    })
    feedUrl = `${await listen(feedServer)}/api/findings-rss`
  })
  test.afterAll(async () => {
    await Promise.all([close(feedServer), close(upstream)])
    for (const [key, value] of Object.entries({
      NEXT_PUBLIC_USER_FEEDBACK_API: previousApi,
      NEXT_PUBLIC_EXPLORER_URL: previousExplorer,
    })) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  })
  test.beforeEach(() => {
    upstreamStatus = 200
    upstreamRequests = []
    upstreamBody = {
      incidents: [
        published,
        { ...published, id: 999, published: false, title: 'Private draft' },
      ],
    }
  })

  test('serves published findings with escaped XML and public absolute links', async ({
    request,
  }) => {
    const response = await request.get(feedUrl, {
      headers: {
        Cookie: 'session=private',
        Authorization: 'Bearer private',
        Host: 'untrusted.example',
      },
    })
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toBe(
      'application/rss+xml; charset=utf-8',
    )
    expect(response.headers()['cache-control']).toContain('s-maxage=600')
    const xml = await response.text()
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('Blocking &amp; interference &lt;example&gt;')
    expect(xml).toContain('A &quot;quoted&quot; description &amp; details')
    expect(xml).toContain(
      '<link>https://explorer.example/findings/censorship-finding</link>',
    )
    expect(xml).toContain(
      '<guid isPermaLink="true">https://explorer.example/findings/1234</guid>',
    )
    expect(xml).toContain('<pubDate>Thu, 14 Sep 2023 10:59:31 GMT</pubDate>')
    expect(xml).not.toMatch(/Private draft|not included|untrusted|\u0001/)
    expect(upstreamRequests).toEqual([
      {
        url: '/api/v1/incidents/search',
        cookie: undefined,
        authorization: undefined,
      },
    ])
  })

  test('an empty published list is a successful valid feed', async ({
    request,
  }) => {
    upstreamBody = { incidents: [] }
    const response = await request.get(feedUrl)
    expect(response.status()).toBe(200)
    expect(await response.text()).toContain('</channel>\n</rss>')
    expect(await response.text()).not.toContain('<item>')
  })

  test('upstream failures and malformed responses are not cached as empty feeds', async ({
    request,
  }) => {
    for (const [status, body] of [
      [500, { detail: 'upstream secret' }],
      [200, { incidents: null }],
    ] as const) {
      upstreamStatus = status
      upstreamBody = body
      const response = await request.get(feedUrl)
      expect(response.status()).toBe(503)
      expect(response.headers()['cache-control']).toBe('no-store')
      expect(await response.text()).toBe(
        'Findings feed temporarily unavailable',
      )
    }
  })

  test('HEAD sends no body and unsupported methods do not fetch findings', async ({
    request,
  }) => {
    expect((await request.head(feedUrl)).status()).toBe(200)
    const response = await request.post(feedUrl)
    expect(response.status()).toBe(405)
    expect(response.headers().allow).toBe('GET, HEAD')
    expect(upstreamRequests).toHaveLength(1)
  })

  test('stable IDs survive slug changes and dates fall back safely', () => {
    const feed = createFindingsFeed(
      [
        {
          ...published,
          slug: 'renamed',
          create_time: 'invalid',
          update_time: '2024-01-02T00:00:00Z',
        },
        {
          ...published,
          id: 2,
          slug: null,
          create_time: null,
          start_time: '2022-01-01T00:00:00Z',
        },
        { ...published, id: 3, create_time: null },
      ],
      'https://explorer.example',
    )
    expect(feed).toContain('https://explorer.example/findings/renamed</link>')
    expect(feed).toContain('https://explorer.example/findings/1234</guid>')
    expect(feed).toContain('Tue, 02 Jan 2024 00:00:00 GMT')
    expect(feed).not.toContain('Invalid Date')
    expect(feed.indexOf('findings/1234</guid>')).toBeLessThan(
      feed.indexOf('findings/2</guid>'),
    )
  })
})
