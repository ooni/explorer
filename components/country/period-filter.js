import React from 'react'
import { Flex, Select } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

const PeriodFilter = () => (
  <Flex>
    <FormattedMessage id='Country.PeriodFilter.Label' >{(msg) => <option value=''>{msg}</option>}</FormattedMessage>
    <Select>
      <FormattedMessage id='Country.PeriodFilter.Option.30Days' >{(msg) => <option value={30}>{msg}</option>}</FormattedMessage>
      <FormattedMessage id='Country.PeriodFilter.Option.2Months' >{(msg) => <option value={60}>{msg}</option>}</FormattedMessage>
      <FormattedMessage id='Country.PeriodFilter.Option.3Months' >{(msg) => <option value={90}>{msg}</option>}</FormattedMessage>
      <FormattedMessage id='Country.PeriodFilter.Option.6Months' >{(msg) => <option value={180}>{msg}</option>}</FormattedMessage>
    </Select>
  </Flex>
)

export default PeriodFilter
