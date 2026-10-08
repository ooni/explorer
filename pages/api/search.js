import rawIndex from 'data/search-index.json'

const MAX_RESULTS = 15
const MAX_PER_TYPE = 6
const MAX_QUERY_LENGTH = 64

// The index holds only domains and networks. Countries and themes are
// matched and suggested client-side against their localized names (see
// components/landing/ExploreBar.tsx).
const hrefFor = (entry) =>
  entry.t === 'network' ? `/as/AS${entry.k}` : `/domain/${entry.k}`

const haystackFor = (entry) =>
  entry.t === 'network'
    ? `as${entry.k} ${entry.k} ${entry.n.toLowerCase()}`
    : entry.k.toLowerCase()

// Built once per server instance. Entries carry a precomputed lowercase
// haystack so request handling never allocates per-entry strings.
const index = rawIndex.map((entry) => {
  const n = entry.n ?? String(entry.k)
  return {
    t: entry.t,
    k: entry.k,
    n,
    w: entry.w ?? 0,
    p: n.toLowerCase(),
    s: haystackFor(entry),
    href: hrefFor(entry),
  }
})

const serialize = ({ t, k, n, href }) => ({ type: t, key: k, name: n, href })

// Default pool for the empty-query response: the most measured domains and
// networks. The client shuffles picks from this pool and adds themes/countries.
const buildDefaultPool = () => {
  const byType = { domain: [], network: [] }
  for (const entry of index) byType[entry.t]?.push(entry)

  const topByWeight = (entries, count) =>
    [...entries].sort((a, b) => b.w - a.w).slice(0, count)

  return [
    ...topByWeight(byType.domain, 40),
    ...topByWeight(byType.network, 40),
  ].map(serialize)
}

const defaultPool = buildDefaultPool()

const search = (q) => {
  const wordPrefix = ` ${q}`
  // Tiers: name prefix > word-boundary prefix in haystack > substring
  const nameMatches = []
  const prefixMatches = []
  const containsMatches = []

  for (const entry of index) {
    if (entry.p.startsWith(q)) {
      nameMatches.push(entry)
    } else if (entry.s.startsWith(q) || entry.s.includes(wordPrefix)) {
      prefixMatches.push(entry)
    } else if (entry.s.includes(q)) {
      containsMatches.push(entry)
    }
  }

  const byWeight = (a, b) => b.w - a.w
  const ranked = [
    ...nameMatches.sort(byWeight),
    ...prefixMatches.sort(byWeight),
    ...containsMatches.sort(byWeight),
  ]

  // Keep rank order but cap how many results a single type can occupy
  // so e.g. domains can't crowd out a matching country or network.
  const results = []
  const perType = {}
  for (const entry of ranked) {
    if ((perType[entry.t] ?? 0) >= MAX_PER_TYPE) continue
    perType[entry.t] = (perType[entry.t] ?? 0) + 1
    results.push(serialize(entry))
    if (results.length >= MAX_RESULTS) break
  }
  return results
}

const searchHandler = (req, res) => {
  const q = String(req.query?.q ?? '')
    .trim()
    .toLowerCase()
    .slice(0, MAX_QUERY_LENGTH)

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=86400, stale-while-revalidate=604800',
  )

  return res.status(200).json({ results: q ? search(q) : defaultPool })
}

export default searchHandler
