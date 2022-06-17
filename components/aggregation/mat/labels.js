import PropTypes from 'prop-types'
import countryUtil from 'country-util'
import { Box } from 'ooni-components'

import { testNames } from '../../test-info'
import { getCategoryCodesMap } from '../../utils/categoryCodes'
import { getLocalisedRegionName } from 'utils/i18nCountries'

const InputRowLabel = ({ input }) => {
  const truncatedInput = input
  return (
    <Box title={input} sx={{
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}>
      {truncatedInput}
    </Box>
  )
}

InputRowLabel.propTypes = {
  input: PropTypes.string,
}

const categoryCodesMap = getCategoryCodesMap()

const blockingTypeLabels = {
  '': '<empty>',
  'dns': 'DNS Tampering',
  'http-diff': 'HTTP Diff',
  'http-failure': 'HTTP Failure',
  'tcp_ip': 'TCP/IP Blocking'
}

export const getRowLabel = (key, yAxis, locale) => {
  switch (yAxis) {
  case 'probe_cc':
    if (locale) return getLocalisedRegionName(key, locale)
    return countryUtil.territoryNames[key] ?? key
  case 'category_code':
    return categoryCodesMap.get(key)?.name ?? key
  case 'input':
  case 'domain':
    return (<InputRowLabel input={key} />)
  case 'blocking_type':
    return blockingTypeLabels[key] ?? key
  case 'probe_asn':
    return `AS${key}`
  case 'test_name':
    return Object.keys(testNames).includes(key) ? testNames[key].id : key
  default:
    return key
  }
}