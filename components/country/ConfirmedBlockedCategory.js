import { CategoryBadge } from 'components/Badge'
import { DetailsBox } from 'components/measurement/DetailsBox'
import { getCategoryCodesMap } from 'components/utils/categoryCodes'
import { useRouter } from 'next/router'
import { Box, Flex, Heading } from 'ooni-components'
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
  const { query: { countryCode, since, until } } = router
  const intl = useIntl()

  const categoryCodeMap = getCategoryCodesMap()

  const query = useMemo(() => ({
    probe_cc: countryCode,
    since,
    until,
    test_name: 'web_connectivity',
    axis_x: 'category_code'
  }), [countryCode, since, until])

  const prepareDataForBadge = (categoriesData) => {
    return categoriesData.filter(category => category.confirmed_count > 0)
  }

  const { data, error } = useSWR(
    since && until ? new URLSearchParams(query).toString() : null,
    MATFetcher,
    swrOptions
  )

  const blockedCategoriesData = useMemo(() => {
    if (!data) {
      return null
    }

    const categoriesData = prepareDataForBadge(data.data)

    return categoriesData
  }, [data])

  return (
      <Flex flexDirection='column' mb={60}>
        <Box><Heading h={3} mt={40} mb={20}>{intl.formatMessage({id: 'Country.Websites.ConfirmedBlockedCategories'})}</Heading></Box>
        <Box>
          {(!blockedCategoriesData && !error) ? (
            <div> Loading ...</div>
          ) : (
            blockedCategoriesData === null || blockedCategoriesData.length === 0 ? (
              <Heading h={5}><FormattedMessage id="General.NoData" /></Heading>
            ) : (
              <Flex flexWrap='wrap' sx={{gap: 2}}>
                {blockedCategoriesData && blockedCategoriesData.map(category => (
                  <CategoryBadge
                    key={category.category_code}
                    categoryCode={category.category_code}
                  />
                ))}
              </Flex>
            )
          )}
        </Box>
        {error &&
          <DetailsBox collapsed={false} content={<>
            <details>
              <summary><span>Error: {error.message}</span></summary>
              <Box as='pre'>
                {JSON.stringify(error, null, 2)}
              </Box>
            </details>
          </>}/>
        }

      </Flex>
  )
}

export default memo(ConfirmedBlockedCategory)
