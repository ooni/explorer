export type LegacyMeasurement = {
  test_name?: string
  test_keys?: Record<string, unknown> | null
}

export type LegacyDetailsProps = {
  measurement: LegacyMeasurement
  isAnomaly: boolean
  isFailure: boolean
}
