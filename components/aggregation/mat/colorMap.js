import { colors } from 'ooni-components'

export const colorMap = {
  confirmed_count: colors.red['700'],
  anomaly_count: colors.yellow['500'],
  failure_count: colors.gray['400'],
  ok_count: colors.green['500'],
  measurement_count: colors.blue['500'],
}

export const v5ColorMap = {
  outcome_blocked: colors.red['700'],
  outcome_down: colors.yellow['500'],
  outcome_ok: colors.green['500'],
}
