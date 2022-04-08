import { Heading, Flex, Box, Text } from 'ooni-components'
import { useIntl } from 'react-intl'
import OONILogo from 'ooni-components/components/svgs/logos/OONI-HorizontalMonochrome.svg'

import { useMATContext } from './MATContext'
import CountryNameLabel from './CountryNameLabel'
import { colorMap } from './colorMap'
import { getRowLabel } from './labels'

const Legend = ({label, color}) => {
  return (
    <Flex alignItems='center'>
      <Box pr={2}>
        <div style={{ width: '10px', height: '10px', backgroundColor: color }} />
      </Box>
      <Box>
        <Text>{label}</Text>
      </Box>
    </Flex>
  )
}

export const SubtitleStr = ({ query }) => {
  const intl = useIntl()
  const params = new Set()

  const testName = intl.formatMessage({id: getRowLabel(query.test_name, 'test_name')})
  params.add(testName)


  if (query.domain) {
    params.add(query.domain)
  }
  if (query.input) {
    params.add(query.input)
  }
  if (query.category_code) {
    params.add(getRowLabel(query.category_code, 'category_code'))
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
    <Flex alignItems={['center']}>
      <Box width={2/16} sx={{ opacity: 0.8 }}>
        <OONILogo height='32px' />
      </Box>
      <Box width={14/16}>
        <Flex flexDirection={['column']}>
          {options.probe_cc !== false && <Heading h={3} textAlign='center'>
            <CountryNameLabel countryCode={query.probe_cc} />
          </Heading>}
          {options.subtitle !== false && <Heading h={5} fontWeight='normal' textAlign='center'>
            {subTitle}
          </Heading>}
          {options.legend !== false && <Flex justifyContent='center' my={2}>
            <Box pr={2}>
              <Legend label='ok_count' color={colorMap['ok_count']} />
            </Box>
            <Box pr={2}>
              <Legend label='confirmed_count' color={colorMap['confirmed_count']} />
            </Box>
            <Box pr={2}>
              <Legend label='anomaly_count' color={colorMap['anomaly_count']} />
            </Box>
            <Box pr={2}>
              <Legend label='failure_count' color={colorMap['failure_count']} />
            </Box>
          </Flex>}
        </Flex>
      </Box>
    </Flex>
  )
}
