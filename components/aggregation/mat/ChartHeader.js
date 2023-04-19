import { Box, Flex, Heading, Text } from 'ooni-components'
import OONILogo from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochrome.svg'
import { useIntl } from 'react-intl'

import { colorMap } from './colorMap'
import CountryNameLabel from './CountryNameLabel'
import { useMATContext } from './MATContext'
import { testGroups, testNames } from '/components/test-info'

const Legend = ({label, color}) => {
  return (
    <Flex alignItems='center' mr={2}>
      <Box px={2}>
        <div style={{ width: '10px', height: '10px', backgroundColor: color }} />
      </Box>
      <Box>
        <Text>{label}</Text>
      </Box>
    </Flex>
  )
}

const getTestNameGroupName = (testNameArray) => {
  // TODO
  // show single test name
  if (testNameArray.length === 1) return [testNames[testNameArray[0]]?.id || testNameArray[0]]

  const testGroup = new Set()
  testNameArray.forEach((t) => {
    testNames[t]?.group && testGroup.add(testNames[t]?.group)
  })
  // if all test names belong to a single group, show group name
  if (testGroup.size === 1) {
    const testGroupName = testGroups[[...testGroup][0]].id
    return [testGroupName]
  }
  // list of multiple test names from different groups
  return testNameArray.map((t) => (testNames[t].id))
}

export const SubtitleStr = ({ query }) => {
  const intl = useIntl()
  const params = new Set()

  if (query.test_name) {
    const testNameQuery = Array.isArray(query.test_name) ? query.test_name : [query.test_name]
    const testNames = getTestNameGroupName(testNameQuery)
    testNames.forEach((testName) => {
      params.add(intl.formatMessage({id: testName, defaultMessage: ''}))
    })
  }
  if (query.domain) {
    params.add(query.domain)
  }
  if (query.input) {
    params.add(query.input)
  }
  if (query.category_code) {
    params.add(intl.formatMessage({id: `CategoryCode.${query.category_code}.Name`, defaultMessage: query.category_code}))
  }
  if (query.probe_asn) {
    params.add(query.probe_asn)
  }

  return [...params].join(', ')
}
/**
 * ChartHeader generates formatted headings to show above the charts in GridChart
 * @param {Object} options - Object with flags for header components eg. { probe_cc: false }
 * @param {boolean} options.probe_cc - Show/hide country name
 */
export const ChartHeader = ({ options = {}}) => {
  const intl = useIntl()
  const [query] = useMATContext()

  const subTitle = <SubtitleStr query={query} />
  return (
    <>
      <Box>
        {options.subtitle !== false && <Heading as='span' h={4}>
          {subTitle}
        </Heading>}
        {options.probe_cc !== false && query.probe_cc && <Heading as='span' h={5}>
          <CountryNameLabel countryCode={query.probe_cc} />
        </Heading>}
      </Box>
      <Box>
        <Flex mb={2} justifyContent='space-between'>
          {options.legend !== false && <Flex justifyContent='center' my={2} flexWrap="wrap">
            <Legend label={intl.formatMessage({id: 'MAT.Table.Header.ok_count'})} color={colorMap['ok_count']} />
            <Legend label={intl.formatMessage({id: 'MAT.Table.Header.confirmed_count'})} color={colorMap['confirmed_count']} />
            <Legend label={intl.formatMessage({id: 'MAT.Table.Header.anomaly_count'})} color={colorMap['anomaly_count']} />
            <Legend label={intl.formatMessage({id: 'MAT.Table.Header.failure_count'})} color={colorMap['failure_count']} />
          </Flex>}
          <Box sx={{ opacity: 0.5 }}>
            <OONILogo height='32px' />
          </Box>
        </Flex>
      </Box>
    </>
  )
}
