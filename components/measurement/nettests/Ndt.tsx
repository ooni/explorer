import PerformanceDetails from '../PerformanceDetails'
import type { LegacyDetailsProps } from './types'

type NdtSummary = {
  retransmit_rate?: number
  min_rtt?: number
  max_rtt?: number
  mss?: number
  download?: number
  upload?: number
  ping?: number
}

type NdtAdvanced = {
  packet_loss?: number
  out_of_order?: number
  min_rtt?: number
  max_rtt?: number
  mss?: number
  timeouts?: number
}

type NdtTestKeys = {
  failure?: string | null
  protocol?: number
  summary?: NdtSummary
  simple?: NdtSummary
  advanced?: NdtAdvanced | null
}

const NdtDetails = ({ measurement }: LegacyDetailsProps) => {
  const testKeys = (measurement.test_keys ?? {}) as NdtTestKeys

  const isFailed = testKeys.failure !== null
  const isNdt7 = testKeys.protocol === 7

  let packetLoss: number | string | undefined
  let maxRTT: string | undefined
  let mss: number | undefined
  let outOfOrder: number | string | null | undefined
  let timeouts: number | undefined

  const simple = (isNdt7 ? testKeys.summary : testKeys.simple) || {}
  const ping = simple.ping?.toFixed(1)

  let performanceDetails: React.ReactNode = null
  if (!isFailed) {
    try {
      if (isNdt7) {
        const summary = testKeys.summary || {}
        packetLoss =
          summary.retransmit_rate && (summary.retransmit_rate * 100).toFixed(3)
        maxRTT = summary.max_rtt?.toFixed(0)
        mss = summary.mss
        outOfOrder = null
        timeouts = undefined
      } else {
        const advanced = testKeys.advanced
        if (!advanced) {
          throw new Error('missing advanced test_keys')
        }
        advanced.out_of_order = undefined
        packetLoss =
          advanced.packet_loss && (advanced.packet_loss * 100).toFixed(3)
        outOfOrder =
          advanced.out_of_order && (advanced.out_of_order * 100).toFixed(1)
        maxRTT = advanced.max_rtt?.toFixed(0)
        mss = advanced.mss
        timeouts = advanced.timeouts
      }
      performanceDetails = (
        <PerformanceDetails
          isNdt7={isNdt7}
          averagePing={ping}
          maxPing={maxRTT}
          mss={mss}
          packetLoss={packetLoss}
          outOfOrder={outOfOrder}
          timeouts={timeouts}
        />
      )
    } catch (e) {
      console.error(`Error in parsing test_keys for ${measurement.test_name}`)
      console.error(e)
    }
  }

  return <>{!isFailed && performanceDetails}</>
}

export default NdtDetails
