import SpinLoader from 'components/vendor/SpinLoader'
import { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import useSWR from 'swr'
import { fetchCtrlGroundTruth, fetchObservations } from './observations/api'
import { chartWindow, ctrlWindow, groupByTarget } from './observations/derive'
import TargetSection from './observations/TargetSection'

type MeasurementContainerProps = {
  measurementUid: string
  measurementStartTime: string
  probeAsn: number | string
}

const observationsFetcher = ([, measurementUid]: [string, string]) =>
  fetchObservations(measurementUid)

const ctrlFetcher = ([, hostKey, since, until]: [
  string,
  string,
  string,
  string,
]) => fetchCtrlGroundTruth(hostKey.split(','), since, until)

const Message = ({ id }: { id: string }) => (
  <div className="my-8 text-gray-600">
    <FormattedMessage id={id} />
  </div>
)

const MeasurementContainer = ({
  measurementUid,
  measurementStartTime,
  probeAsn,
}: MeasurementContainerProps) => {
  const {
    data: observations,
    error,
    isLoading,
  } = useSWR(
    measurementUid ? ['observations', measurementUid] : null,
    observationsFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  )

  const hostnames = useMemo(
    () =>
      [
        ...new Set((observations ?? []).map((o) => o.hostname).filter(Boolean)),
      ] as string[],
    [observations],
  )

  const ctrlRange = useMemo(
    () => ctrlWindow(measurementUid, measurementStartTime),
    [measurementUid, measurementStartTime],
  )

  // The control ground truth is keyed by hostname, so it can only be requested
  // once the observations are in
  const { data: ctrl } = useSWR(
    hostnames.length > 0
      ? [
          'observations-ctrl',
          hostnames.join(','),
          ctrlRange.since,
          ctrlRange.until,
        ]
      : null,
    ctrlFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false },
  )

  const groups = useMemo(
    () => (observations ? groupByTarget(observations, ctrl ?? []) : []),
    [observations, ctrl],
  )

  const chart = useMemo(
    () => chartWindow(measurementUid, measurementStartTime),
    [measurementUid, measurementStartTime],
  )

  const probeASN = Number(String(probeAsn).replace(/^AS/, ''))

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <SpinLoader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-100 p-4 my-8">
        <FormattedMessage
          id="Measurement.Observations.Error"
          values={{ error: error.message }}
        />
      </div>
    )
  }

  // Only web observations are indexed, so tests outside that family legitimately
  // have nothing to show here
  if (groups.length === 0) {
    return <Message id="Measurement.Observations.None" />
  }

  return (
    <div>
      <p className="text-gray-600">
        <FormattedMessage
          id="Measurement.Observations.Summary"
          values={{
            observations: observations?.length ?? 0,
            targets: groups.length,
          }}
        />
      </p>
      {groups.map((group) => (
        <TargetSection
          key={group.key}
          group={group}
          probeASN={probeASN}
          chartSince={chart.since}
          chartUntil={chart.until}
        />
      ))}
    </div>
  )
}

export default MeasurementContainer
