import type {
  AggregationEntry,
  CtrlGroundTruthEntry,
  WebObservation,
} from './types'

const apiUrl = (path: string): string =>
  `${process.env.NEXT_PUBLIC_OONI_API}/api${path}`

async function getJSON<T>(fullUrl: string): Promise<T> {
  const r = await fetch(fullUrl)
  if (!r.ok) {
    const body = await r.json().catch(() => null)
    throw new Error(body?.detail || `${r.status} ${r.statusText}`)
  }
  return r.json()
}

// A report may bundle several measurements, so rows are filtered down to the
// requested measurement client-side as well.
export async function fetchObservations(
  measurementUid: string,
): Promise<WebObservation[]> {
  const limit = 500
  const maxPages = 10
  const rows: WebObservation[] = []
  for (let page = 0; page < maxPages; page++) {
    const q = new URLSearchParams({
      measurement_uid: measurementUid,
      limit: String(limit),
      offset: String(page * limit),
    })
    const data = await getJSON<{ results: WebObservation[] }>(
      apiUrl(`/v1/observations?${q}`),
    )
    rows.push(
      ...data.results.filter((r) => r.measurement_uid === measurementUid),
    )
    if (data.results.length < limit) break
  }
  return rows.sort((a, b) => a.observation_idx - b.observation_idx)
}

export async function fetchCtrlGroundTruth(
  hostnames: string[],
  since: string,
  until: string,
): Promise<CtrlGroundTruthEntry[]> {
  const q = new URLSearchParams({ since, until })
  for (const h of hostnames) q.append('hostname', h)
  const data = await getJSON<{ results: CtrlGroundTruthEntry[] }>(
    apiUrl(`/v1/aggregation/observations/ctrl?${q}`),
  )
  return data.results
}

export interface AggregationParams {
  // A target can span several hostnames; the per-day buckets sum across them
  hostnames: string[]
  probeASN: number
  // When set the aggregation is restricted to observations whose resolver_asn
  // matches; when undefined every resolver is included.
  resolverASN?: number
  since: string
  until: string
  timeGrain?: 'hour' | 'day' | 'week' | 'month'
}

export async function fetchAggregatedObservations(
  p: AggregationParams,
): Promise<AggregationEntry[]> {
  const q = new URLSearchParams({
    since: p.since,
    until: p.until,
    time_grain: p.timeGrain ?? 'day',
  })
  q.append('group_by', 'timestamp')
  q.append('group_by', 'failure')
  for (const h of p.hostnames) q.append('hostname', h)
  q.append('probe_asn', String(p.probeASN))
  if (p.resolverASN !== undefined) {
    q.append('resolver_asn', String(p.resolverASN))
  }
  const data = await getJSON<{ results: AggregationEntry[] }>(
    apiUrl(`/v1/aggregation/observations?${q}`),
  )
  return data.results
}
