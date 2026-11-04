import { MdTimer } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import AccessPointStatus from '../AccessPointStatus'
import type { LegacyDetailsProps } from './types'

const PsiphonDetails = ({ measurement }: LegacyDetailsProps) => {
  const bootstrap_time = measurement.test_keys?.bootstrap_time

  return (
    <>
      {!!bootstrap_time && (
        <AccessPointStatus
          icon={<MdTimer />}
          label={
            <FormattedMessage id="Measurement.Details.Psiphon.BootstrapTime.Label" />
          }
          content={Number(bootstrap_time).toFixed(2)}
          ok={true}
        />
      )}
    </>
  )
}

export default PsiphonDetails
