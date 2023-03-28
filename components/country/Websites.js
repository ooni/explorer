import React, {useCallback, useMemo} from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { Box, Text } from 'ooni-components'
import ChartCountry from 'components/Chart'
import SectionHeader from './SectionHeader'
import { SimpleBox } from './boxes'
import FormattedMarkdown from '../FormattedMarkdown'
import ConfirmedBlockedCategory from './ConfirmedBlockedCategory'
import { useRouter } from 'next/router'

const WebsitesSection = ({ countryCode }) => {
  const router = useRouter()
  const { query: { since, until } } = router

  const query = useMemo(() => ({
    axis_y: 'domain',
    axis_x: 'measurement_start_day',
    probe_cc: countryCode,
    since,
    until,
    test_name: 'web_connectivity',
    time_grain: 'day',
  }), [countryCode, since, until])

  return (
    <>
      <SectionHeader>
        <SectionHeader.Title name='websites'>
          <FormattedMessage id='Country.Heading.Websites' />
        </SectionHeader.Title>
      </SectionHeader>
      <SimpleBox>
        <Text fontSize={16}>
          <FormattedMarkdown id='Country.Websites.Description' />
        </Text>
      </SimpleBox>
      <ConfirmedBlockedCategory title='Confirmed blocked categories' />
      <Box my={4}>
        <ChartCountry
          testName='web_connectivity'
          queryParams={query}
        />
      </Box>
    </>
  )
}

export default WebsitesSection