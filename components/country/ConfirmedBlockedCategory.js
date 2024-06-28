import { CategoryBadge } from 'components/Badge'
import { DetailsBox } from 'components/measurement/DetailsBox'
import { useRouter } from 'next/router'
import { memo, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { MATFetcher } from 'services/fetchers'
import useSWR from 'swr'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const ConfirmedBlockedCategory = () => {
  const router = useRouter()
  const {
    query: { countryCode, since, until },
  } = router
  const intl = useIntl()

  const query = useMemo(
    () => ({
      probe_cc: countryCode,
      since,
      until,
      test_name: 'web_connectivity',
      axis_x: 'category_code',
    }),
    [countryCode, since, until],
  )

  const prepareDataForBadge = (categoriesData) => {
    return categoriesData.filter((category) => category.confirmed_count > 0)
  }

  const { data, error } = useSWR(
    since && until ? new URLSearchParams(query).toString() : null,
    MATFetcher,
    swrOptions,
  )

  const blockedCategoriesData = useMemo(() => {
    if (!data) {
      return null
    }

    const categoriesData = prepareDataForBadge(data.data)

    return categoriesData
  }, [data])

  return (
    <div className="flex flex-col mb-[60px]">
      <h3 className="mt-[40px] mb-[20px]">
        {intl.formatMessage({
          id: 'Country.Websites.ConfirmedBlockedCategories',
        })}
      </h3>
      <>
        {!blockedCategoriesData && !error ? (
          <div> Loading ...</div>
        ) : blockedCategoriesData === null ||
          blockedCategoriesData.length === 0 ? (
          <h5>
            <FormattedMessage id="General.NoData" />
          </h5>
        ) : (
          <div className="flex flex-wrap gap-2">
            {blockedCategoriesData?.map((category) => (
              <CategoryBadge
                key={category.category_code}
                categoryCode={category.category_code}
              />
            ))}
          </div>
        )}
      </>
      {error && (
        <DetailsBox
          collapsed={false}
          content={
            <>
              <details>
                <summary>
                  <span>Error: {error.message}</span>
                </summary>
                <pre>{JSON.stringify(error, null, 2)}</pre>
              </details>
            </>
          }
        />
      )}
    </div>
  )
}

export default memo(ConfirmedBlockedCategory)
