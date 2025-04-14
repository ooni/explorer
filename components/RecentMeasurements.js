import Link from 'next/link'
import { MdOutlineSearch } from 'react-icons/md'
import { useIntl } from 'react-intl'
import useSWR from 'swr'
import ResultsList from './search/ResultsList'
import { useInView } from 'react-intersection-observer'
import { ChartSpinLoader } from './Chart'
import { simpleFetcher } from 'services/fetchers'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const List = ({ query }) => {
  const { data: recentMeasurements, error: recentMeasurementsError } = useSWR(
    ['/api/v1/measurements', { limit: 5, failure: false, ...query }],
    simpleFetcher,
    swrOptions,
  )

  return (
    <>
      {recentMeasurements ? (
        <ResultsList results={recentMeasurements} />
      ) : (
        <ChartSpinLoader height="340px" />
      )}
    </>
  )
}

const RecentMeasurements = ({ query }) => {
  const intl = useIntl()

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <>
      <h2 className="mb-4 mt-8">
        {intl.formatMessage({ id: 'Domain.RecentMeasurements.Title' })}
      </h2>
      <div ref={ref}>
        {inView ? <List query={query} /> : <ChartSpinLoader height="340px" />}
      </div>
      <Link href={`/search?${new URLSearchParams(query)}`}>
        <button type="button" className="btn btn-primary-hollow mt-4 mb-16">
          {intl.formatMessage({ id: 'Domain.Button.SearchResults' })}{' '}
          <MdOutlineSearch size={20} style={{ verticalAlign: 'bottom' }} />
        </button>
      </Link>
    </>
  )
}

export default RecentMeasurements
