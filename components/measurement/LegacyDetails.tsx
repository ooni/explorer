import SpinLoader from 'components/vendor/SpinLoader'
import { legacyDetailsFor } from './nettests'
import type { LegacyMeasurement } from './nettests/types'

type LegacyDetailsViewProps = {
  testName?: string | null
  measurement?: LegacyMeasurement | null
  isAnomaly: boolean
  isFailure: boolean
  isLoading: boolean
}

const LegacyDetails = ({
  testName,
  measurement,
  isAnomaly,
  isFailure,
  isLoading,
}: LegacyDetailsViewProps) => {
  const Details = legacyDetailsFor(testName)
  if (!Details) return null

  if (isLoading || !measurement) {
    return (
      <div className="flex justify-center my-8">
        <SpinLoader />
      </div>
    )
  }

  return (
    <Details
      measurement={measurement}
      isAnomaly={isAnomaly}
      isFailure={isFailure}
    />
  )
}

export default LegacyDetails
