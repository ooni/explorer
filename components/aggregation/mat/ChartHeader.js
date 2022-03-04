import { Heading, Flex, Box, Text } from 'ooni-components'
import { useIntl } from 'react-intl'

import { useMATContext } from './MATContext'
import CountryNameLabel from './CountryNameLabel'
import { colorMap } from './colorMap'

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


export const getSubtitleStr = (query) => {
  let str = `${query.test_name}`
  if (query.input) {
    str += `, ${query.input}`
  }
  if (query.category_code) {
    str += `, ${query.category_code}`
  }
  if (query.probe_asn) {
    str += `, ${query.probe_asn}`
  }
  return str
}

export const ChartHeader = () => {
  const intl = useIntl()
  const [query] = useMATContext()

  const subTitle = getSubtitleStr(query)

  return (
    <Flex flexDirection={['column']}>
      <Heading h={3} textAlign='center'>
        <CountryNameLabel countryCode={query.probe_cc} />
      </Heading>
      <Heading h={5} fontWeight='normal' textAlign='center'>
        {subTitle}
      </Heading>
      <Flex justifyContent='center' my={2}>
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
      </Flex>
    </Flex>
  )
}