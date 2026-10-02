import type { ComponentType } from 'react'
import NdtDetails from './Ndt'
import PsiphonDetails from './Psiphon'
import TorSnowflakeDetails from './TorSnowflake'
import type { LegacyDetailsProps } from './types'
import VanillaTorDetails from './VanillaTor'

const OBSERVATION_TESTS = new Set([
  'web_connectivity',
  'whatsapp',
  'facebook_messenger',
  'telegram',
  'signal',
  'tor',
])

export const usesObservations = (testName?: string | null) =>
  !!testName && OBSERVATION_TESTS.has(testName)

const LEGACY_DETAILS: Record<string, ComponentType<LegacyDetailsProps>> = {
  ndt: NdtDetails,
  psiphon: PsiphonDetails,
  vanilla_tor: VanillaTorDetails,
  torsf: TorSnowflakeDetails,
}

// Legacy tests not listed here (dash, http_header_field_manipulation,
// http_invalid_request_line, and the default view) contribute hero and
// summary only, which the centralized helpers already cover.
export const legacyDetailsFor = (testName?: string | null) =>
  (testName && LEGACY_DETAILS[testName]) || null
