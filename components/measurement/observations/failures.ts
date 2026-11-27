import { colors } from 'ooni-components'
import type { AggregationEntry } from './types'

// Failure families as classified by the aggregation endpoint (prefix before
// the first dot). Order is fixed — it is also the stacking order.
export const FAILURE_FAMILIES = [
  {
    key: 'dns_isp',
    labelId: 'Measurement.Observations.Failure.DnsIsp',
    color: colors.blue['500'],
  },
  {
    key: 'dns_other',
    labelId: 'Measurement.Observations.Failure.DnsOther',
    color: colors.orange['500'],
  },
  {
    key: 'tcp',
    labelId: 'Measurement.Observations.Failure.Tcp',
    color: colors.teal['500'],
  },
  {
    key: 'tls',
    labelId: 'Measurement.Observations.Failure.Tls',
    color: colors.yellow['600'],
  },
  {
    key: 'https',
    labelId: 'Measurement.Observations.Failure.Https',
    color: colors.pink['500'],
  },
  {
    key: 'http',
    labelId: 'Measurement.Observations.Failure.Http',
    color: colors.green['700'],
  },
] as const

export type FamilyKey = (typeof FAILURE_FAMILIES)[number]['key']

// Observations without a failure, stacked under the failure families in a
// recessive neutral so the coloured failures stay the loud part.
export const NONE_SERIES = {
  key: 'none',
  labelId: 'Measurement.Observations.Failure.None',
  color: colors.gray['300'],
} as const

export type Series = {
  key: string
  labelId: string
  color: string
}

export interface DayBucket {
  day: string // YYYY-MM-DD
  total: number // all observations, including non-failing ones
  none: number
  byFamily: Record<FamilyKey, number>
  // exact failure string -> count, for the tooltip breakdown
  details: Map<string, number>
}

export const familyOf = (failure: string): FamilyKey | null => {
  const fam = failure.split('.', 1)[0]
  return FAILURE_FAMILIES.some((f) => f.key === fam) ? (fam as FamilyKey) : null
}

export function bucketByDay(
  entries: AggregationEntry[],
  since: string,
  until: string,
): DayBucket[] {
  const buckets = new Map<string, DayBucket>()
  const dayMs = 24 * 3600 * 1000
  const start = new Date(`${since.slice(0, 10)}T00:00:00Z`).getTime()
  const end = new Date(`${until.slice(0, 10)}T00:00:00Z`).getTime()
  for (let t = start; t <= end; t += dayMs) {
    const day = new Date(t).toISOString().slice(0, 10)
    buckets.set(day, {
      day,
      total: 0,
      none: 0,
      byFamily: {
        dns_isp: 0,
        dns_other: 0,
        tcp: 0,
        tls: 0,
        https: 0,
        http: 0,
      },
      details: new Map(),
    })
  }
  for (const e of entries) {
    if (!e.timestamp || !e.failure) continue
    const b = buckets.get(e.timestamp.slice(0, 10))
    if (!b) continue
    b.total += e.observation_count
    if (e.failure === 'none') {
      b.none += e.observation_count
      continue
    }
    const fam = familyOf(e.failure)
    if (!fam) continue
    b.byFamily[fam] += e.observation_count
    b.details.set(
      e.failure,
      (b.details.get(e.failure) ?? 0) + e.observation_count,
    )
  }
  return [...buckets.values()]
}

// Tallest stack: no-failure observations plus every failure family
export const maxStack = (buckets: DayBucket[]): number =>
  Math.max(
    0,
    ...buckets.map(
      (b) =>
        b.none + FAILURE_FAMILIES.reduce((s, f) => s + b.byFamily[f.key], 0),
    ),
  )
