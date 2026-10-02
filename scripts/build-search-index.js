const fs = require('fs')
const path = require('path')

/**
 * Builds a compact search index for the landing page ExploreBar.
 * Contains domains and networks from the OONI API. Countries and thematic
 * pages are handled client-side (see components/landing/ExploreBar.tsx), so
 * they are intentionally not part of this index.
 *
 * Entry shape (short keys to keep the file small):
 *   t: type ('domain' | 'network')
 *   k: key (domain name or ASN number)
 *   n: display name (network org name; omitted for domains where it equals k)
 *   w: weight for ranking (measurement count)
 */

async function buildSearchIndex() {
  const apiUrl = process.env.NEXT_PUBLIC_OONI_API || 'https://api.ooni.io'
  const outputPath = path.join(__dirname, '..', 'data', 'search-index.json')

  try {
    console.log(`Fetching domains and networks from ${apiUrl}...`)
    const [domainsRes, networksRes] = await Promise.all([
      fetch(`${apiUrl}/api/_/domains`),
      fetch(`${apiUrl}/api/_/networks`),
    ])

    if (!domainsRes.ok) {
      throw new Error(`Domains request failed: HTTP ${domainsRes.status}`)
    }
    if (!networksRes.ok) {
      throw new Error(`Networks request failed: HTTP ${networksRes.status}`)
    }

    const domainsData = await domainsRes.json()
    const networksData = await networksRes.json()

    const seenDomains = new Set()
    const domains = []
    for (const d of domainsData.results) {
      if (!d.domain_name || seenDomains.has(d.domain_name)) continue
      seenDomains.add(d.domain_name)
      domains.push({
        t: 'domain',
        k: d.domain_name,
        w: d.measurement_count || 0,
      })
    }

    const networks = networksData.results
      .filter((a) => a.probe_asn)
      .map((a) => ({
        t: 'network',
        k: a.probe_asn,
        n: a.org_name || '',
        w: a.cnt || 0,
      }))

    const index = [...domains, ...networks]

    fs.writeFileSync(outputPath, JSON.stringify(index))
    console.log(
      `✓ Search index with ${index.length} entries (${domains.length} domains, ${networks.length} networks) saved to ${outputPath}`,
    )
  } catch (error) {
    console.error('Error building search index:', error.message)
    process.exit(1)
  }
}

buildSearchIndex()
