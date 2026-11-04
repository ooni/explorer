import { MdCheckCircle } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import AccessPointStatus from '../AccessPointStatus'
import type { LegacyDetailsProps } from './types'

const VanillaTorDetails = ({ isAnomaly }: LegacyDetailsProps) => {
  return (
    <div className="container">
      <div className="flex">
        <AccessPointStatus
          width={1 / 4}
          icon={<MdCheckCircle />}
          label={
            <FormattedMessage id="Measurement.Details.VanillaTor.Endpoint.Label.Reachability" />
          }
          ok={!isAnomaly}
        />
      </div>
    </div>
  )
}

export default VanillaTorDetails
