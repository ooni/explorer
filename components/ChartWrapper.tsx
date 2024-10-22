import Chart, { ChartSpinLoader } from 'components/Chart'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useInView } from 'react-intersection-observer'

type ChartWrapperProps = {
  domain?: string
  testName?: string
  headerOptions?: object
}

const ChartWrapper = ({
  domain,
  testName = 'web_connectivity',
  headerOptions,
}: ChartWrapperProps) => {
  const router = useRouter()

  const {
    query: { since, until, probe_cc },
  } = router

  const query = useMemo(
    () => ({
      axis_x: 'measurement_start_day',
      axis_y: 'probe_cc',
      since,
      until,
      test_name: testName,
      ...(domain && { domain }),
      ...(probe_cc && { probe_cc }),
      time_grain: 'day',
    }),
    [domain, since, until, probe_cc, testName],
  )

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '-300px 0px 0px 0px',
    threshold: 0.5,
    initialInView: false,
  })

  return (
    <div ref={ref}>
      {inView ? (
        <Chart
          // testName={testName}
          queryParams={query}
          headerOptions={headerOptions}
        />
      ) : (
        <ChartSpinLoader />
      )}
    </div>
  )
}

export default ChartWrapper
