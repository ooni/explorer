import { colors } from 'ooni-components'

const okColor = '#91eb8d'

export const blockingTypeColors = {
  dns_isp: {
    ok: okColor,
    blocked: colors.orange['600'],
    down: colors.blue['300'],
  },
  dns_other: {
    ok: okColor,
    blocked: colors.yellow['500'],
    down: colors.indigo['300'],
  },
  tls: {
    ok: okColor,
    blocked: colors.red['800'],
    down: colors.violet['200'],
  },
  tcp: {
    ok: okColor,
    blocked: colors.pink['600'],
    down: colors.cyan['300'],
  },
}

export const colorMap = {
  confirmed_count: colors.red['700'],
  anomaly_count: colors.yellow['500'],
  failure_count: colors.gray['400'],
  ok_count: colors.green['500'],
  measurement_count: colors.blue['500'],
  'dns_isp.down': blockingTypeColors.dns_isp.down,
  'dns_isp.blocked': blockingTypeColors.dns_isp.blocked,
  'dns_isp.ok': blockingTypeColors.dns_isp.ok,
  'dns_other.down': blockingTypeColors.dns_other.down,
  'dns_other.blocked': blockingTypeColors.dns_other.blocked,
  'dns_other.ok': blockingTypeColors.dns_other.ok,
  'tls.down': blockingTypeColors.tls.down,
  'tls.blocked': blockingTypeColors.tls.blocked,
  'tls.ok': blockingTypeColors.tls.ok,
  'tcp.down': blockingTypeColors.tcp.down,
  'tcp.blocked': blockingTypeColors.tcp.blocked,
  'tcp.ok': blockingTypeColors.tcp.ok,
  ok: blockingTypeColors.tls.ok,
}
