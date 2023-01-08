import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
import { Heading, Box, Flex, Text, theme } from 'ooni-components'
import useSWR from 'swr'
import { DetailsBox } from 'components/measurement/DetailsBox'
import { MATFetcher } from 'services/fetchers'
import * as icons from 'ooni-components/dist/icons'
import Badge from 'components/Badge'
import { getCategoryCodesMap } from 'components/utils/categoryCodes'

const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 10 * 60 * 1000,
}

const ConfirmedBlockedCategory = React.memo(function Chart({testName, title, queryParams = {}}) {
  const router = useRouter()
  const { query: { countryCode } } = router

  const categoryCodeMap = getCategoryCodesMap()

  const params = useMemo(() => ({
    ...queryParams,
    axis_x: 'category_code'
  }), [queryParams])

  const query = useMemo(() => ({
    ...params,
    probe_cc: countryCode,
    ...testName && {test_name: testName}
  }), [countryCode, params, testName])

  const apiQuery = useMemo(() => {
    const qs = new URLSearchParams(query).toString()
    return qs
  }, [query])

  const prepareDataForBadge = (categoriesData) => {
    return categoriesData.filter(category => category.confirmed_count > 0)
  }

  const { data, error } = useSWR(
    apiQuery,
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
        <Box><Heading h={3} mt={40} mb={20}>{title}</Heading></Box>
        <Box>
          {(!blockedCategoriesData && !error) ? (
            <div> Loading ...</div>
          ) : (
            blockedCategoriesData === null || blockedCategoriesData.length === 0 ? (
              <Heading h={5}><FormattedMessage id="General.NoData" /></Heading>
            ) : (
              <Flex flexWrap='wrap'>
                {blockedCategoriesData && blockedCategoriesData.map(category => (
                  <CategoryBadge
                    key={category.category_code}
                    categoryCode={category.category_code}
                    categoryCodeMap={categoryCodeMap}
                    confirmedCount={category.confirmed_count}
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
})

const CategoryBadge = ({ categoryCode, categoryCodeMap, confirmedCount }) => {
  const categoryDesc = categoryCodeMap.get(categoryCode)
  const CategoryIcon = icons[`CategoryCode${categoryCode}`]

  if (categoryDesc === undefined && confirmedCount === 0) {
    return null
  }

  if (CategoryIcon === undefined) {
    return null
  }

  return (
    <Badge bg={theme.colors.gray6} color='white' style={{ marginRight: '10px', marginBottom: '15px' }}>
      <Flex alignItems='center'>
        <Box mr={3}>
          <CategoryIcon size={20} />
        </Box>
        <Box>
        <Text><FormattedMessage id={categoryDesc.name} /></Text>
        </Box>
      </Flex>
    </Badge>
  )
}

export default ConfirmedBlockedCategory
