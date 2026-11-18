const outcomeStatuses = {
  ok: 'reachable',
  reachable: 'reachable',
  anomaly: 'anomaly',
  confirmed: 'confirmed',
  down: 'down',
  failure: 'error',
  error: 'error',
}

/**
 * Maps the `analysis` object returned by measurement_meta to the page status
 * and the flags used by the per-test hero and summary helpers. Returns null
 * when the outcome is missing or unknown so callers can fall back to the
 * legacy anomaly/confirmed/failure fields.
 *
 * Prefer `final_analysis` over `fastpath_analysis` when present; both share
 * the same shape. `analysis_ready` is true while the analysis pipeline is
 * still running — show that as preliminary. Measurements with no pipeline
 * analysis keep `final_analysis` null and `analysis_ready` false.
 */
export const getAnalysisOutcome = (analysis) => {
  const status = outcomeStatuses[analysis?.outcome]
  if (!status) return null

  const result = analysis.final_analysis ?? analysis.fastpath_analysis
  const blockingTypes = result?.blocking_type
  const blockingType = Array.isArray(blockingTypes)
    ? (blockingTypes[0] ?? null)
    : (blockingTypes ?? null)

  return {
    status,
    isConfirmed: status === 'confirmed',
    isAnomaly: status === 'anomaly' || status === 'confirmed',
    isFailure: status === 'error',
    blockingType,
    isPreliminary: analysis.analysis_ready === false,
  }
}
