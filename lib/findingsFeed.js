const escapeXml = (value) =>
  String(value ?? '')
    .replace(
      /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu,
      '',
    )
    .replace(
      /[&<>"']/g,
      (character) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&apos;',
        })[character],
    )

const publicationDate = (incident) => {
  for (const value of [
    incident.create_time,
    incident.update_time,
    incident.start_time,
  ]) {
    if (!value) continue
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) return date
  }
  return null
}

export const createFindingsFeed = (incidents, explorerUrl) => {
  const base = new URL(explorerUrl).origin
  const findings = incidents
    .filter((incident) => incident.published === true && incident.id != null)
    .map((incident) => ({ incident, date: publicationDate(incident) }))
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
  const items = findings
    .map(({ incident, date }) => {
      const link = `${base}/findings/${encodeURIComponent(incident.slug || incident.id)}`
      const guid = `${base}/findings/${encodeURIComponent(incident.id)}`
      return `<item>
<title>${escapeXml(incident.title)}</title>
<link>${escapeXml(link)}</link>
<guid isPermaLink="true">${escapeXml(guid)}</guid>
<description>${escapeXml(incident.short_description)}</description>
${date ? `<pubDate>${date.toUTCString()}</pubDate>` : ''}
</item>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>OONI Internet Censorship Findings</title>
<link>${escapeXml(base)}/findings</link>
<description>Internet censorship findings from OONI Explorer.</description>
<language>en</language>
<atom:link href="${escapeXml(base)}/api/findings-rss" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`
}

export const serveFindingsFeed = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    res.statusCode = 405
    res.end()
    return
  }
  try {
    // This is a public server-side request: do not forward a reader's credentials.
    const url = new URL(
      '/api/v1/incidents/search',
      process.env.NEXT_PUBLIC_USER_FEEDBACK_API,
    )
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!response.ok) throw new Error('Findings request failed')
    const data = await response.json()
    if (!Array.isArray(data.incidents))
      throw new Error('Invalid findings response')
    const feed = createFindingsFeed(
      data.incidents,
      process.env.NEXT_PUBLIC_EXPLORER_URL,
    )
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=600, stale-while-revalidate=60',
    )
    res.statusCode = 200
    res.end(req.method === 'HEAD' ? undefined : feed)
  } catch {
    // A temporary upstream failure must not look like an empty successful feed.
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.statusCode = 503
    res.end(
      req.method === 'HEAD'
        ? undefined
        : 'Findings feed temporarily unavailable',
    )
  }
}
