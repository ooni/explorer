import { colors } from 'ooni-components'

export const colorMap = {
  confirmed_count: colors.red['700'],
  anomaly_count: colors.yellow['500'],
  failure_count: colors.gray['400'],
  ok_count: colors.green['500'],
  measurement_count: colors.blue['500'],
  outcome_blocked: colors.red['700'],
  outcome_down: colors.yellow['500'],
  outcome_ok: colors.green['500'],
  dns_isp_blocked: colors.red['700'],
  dns_isp_down: colors.yellow['500'],
  dns_isp_ok: colors.green['500'],
  dns_other_blocked: colors.red['700'],
  dns_other_down: colors.yellow['500'],
  dns_other_ok: colors.green['500'],
  tls_blocked: colors.red['700'],
  tls_down: colors.yellow['500'],
  tls_ok: colors.green['500'],
  tcp_blocked: colors.red['700'],
  tcp_down: colors.yellow['500'],
  tcp_ok: colors.green['500'],
}

export const v5ColorMap = {
  outcome_blocked: colors.red['700'],
  outcome_down: colors.yellow['500'],
  outcome_ok: colors.green['500'],
}
