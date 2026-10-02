import type { ReactNode } from 'react'
import { MdTimer } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import AccessPointStatus from '../AccessPointStatus'
import type { LegacyDetailsProps } from './types'

const TorSnowflakeDetails = ({
  isAnomaly,
  isFailure,
  measurement,
}: LegacyDetailsProps) => {
  const bootstrap_time = measurement.test_keys?.bootstrap_time
  const failure = measurement.test_keys?.failure

  return (
    <>
      {isAnomaly && (
        <AccessPointStatus
          label={
            <FormattedMessage id="Measurement.Details.TorSnowflake.Error.Label" />
          }
          content={failure as ReactNode}
          ok={true}
        />
      )}
      {!isAnomaly && !isFailure && bootstrap_time !== null && (
        <AccessPointStatus
          icon={<MdTimer />}
          label={
            <FormattedMessage id="Measurement.Details.TorSnowflake.BootstrapTime.Label" />
          }
          content={Number(bootstrap_time).toFixed(2)}
          ok={true}
        />
      )}
    </>
  )
}

export default TorSnowflakeDetails
