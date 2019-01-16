import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Text } from 'ooni-components'
import { getTestMetadata } from '../utils'

const SummaryText = ({
  testName,
  network,
  country,
  date,
  hint = 'is reachable',
  testUrl,

}) => {
  const metadata = getTestMetadata(testName)
  const formattedDate = moment(date).format('LL')
  const formattedDateTime = moment(date).format('lll')
  return (
    <Text py={4} fontSize={3}>
      The <a href={metadata.info}>{metadata.name}</a> test
      of {testUrl && <a href={testUrl}>{testUrl}</a>} in the {network} network
      of {country} on <abbr title={formattedDateTime}>{formattedDate}</abbr>&nbsp;
      {hint}. Check the network measurement data below, as well as other
      measurements from this network testing this site to explore further.
    </Text>
  )
}

SummaryText.propTypes = {
  testName: PropTypes.string.isRequired,
  network: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  hint: PropTypes.object.isRequired,
  testUrl: PropTypes.string
}

export default SummaryText
