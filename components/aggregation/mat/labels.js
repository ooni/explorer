import PropTypes from 'prop-types'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import { testNames } from '../../test-info'

const InputRowLabel = ({ input }) => {
  const truncatedInput = input
  return (
    <div className="truncate" title={input}>
      {truncatedInput}
    </div>
  )
}

InputRowLabel.propTypes = {
  input: PropTypes.string,
}

const blockingTypeLabels = {
  '': '<empty>',
  dns: 'DNS Tampering',
  'http-diff': 'HTTP Diff',
  'http-failure': 'HTTP Failure',
  tcp_ip: 'TCP/IP Blocking',
}

export const getRowLabel = (key, yAxis, locale = 'en') => {
  const messages = require(`/public/static/lang/${locale}.json`)

  switch (yAxis) {
    case 'probe_cc':
      return getLocalisedRegionName(key, locale)
    case 'category_code':
      return messages[`CategoryCode.${key}.Name`]
    case 'input':
    case 'domain':
      return <InputRowLabel input={key} />
    case 'blocking_type':
      return blockingTypeLabels[key] ?? key
    case 'probe_asn':
      return `AS${key}`
    case 'test_name':
      return Object.keys(testNames).includes(key)
        ? messages[testNames[key].id]
        : key
    default:
      return key
  }
}
