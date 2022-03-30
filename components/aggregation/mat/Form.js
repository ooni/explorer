import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import styled from 'styled-components'
import {
  Flex, Box,
  Label, Input, Select, Button
} from 'ooni-components'
import { countryList } from 'country-util'
import moment from 'moment'
import dayjs from 'services/dayjs'
import { defineMessages, useIntl, FormattedMessage } from 'react-intl'

import { categoryCodes } from '../../utils/categoryCodes'
import DatePicker from '../../DatePicker'
import { ConfirmationModal } from './ConfirmationModal'

const THRESHOLD_IN_MONTHS = 12

export const StyledLabel = styled(Label).attrs({
  my: 2,
  color: 'blue5',
})`
`

const messages = defineMessages({
  'measurement_start_day': {
    id: 'MAT.Form.Label.AxisOption.measurement_start_day',
    defaultMessage: ''
  },
  'domain': {
    id: 'MAT.Form.Label.AxisOption.domain',
    defaultMessage: ''
  },
  'category_code': {
    id: 'MAT.Form.Label.AxisOption.category_code',
    defaultMessage: ''
  },
  'probe_cc': {
    id: 'MAT.Form.Label.AxisOption.probe_cc',
    defaultMessage: 'D'
  },
  'probe_asn': {
    id: 'MAT.Form.Label.AxisOption.probe_asn',
    defaultMessage: ''
  },
})


const xAxisOptions = [
  'measurement_start_day',
  'category_code',
  'probe_cc',
  ''
]

const yAxisOptions = [
  'domain',
  'category_code',
  'probe_cc',
  'probe_asn',
  ''
]

const testsWithValidDomainFilter = [
  'web_connectivity',
  'http_requests',
  'dns_consistency',
  'tcp_connect'
]

function isValidFilterForTestname(testName = 'XX', arrayWithMapping) {
  // whether the dependent filter is valid to show along with `testName`
  return arrayWithMapping.includes(testName)
}


const tomorrow = dayjs.utc().add(1, 'day').format('YYYY-MM-DD')
const lastMonthToday = dayjs.utc().subtract(30, 'day').format('YYYY-MM-DD')

const defaultDefaultValues = {
  probe_cc: '',
  probe_asn: '',
  test_name: 'web_connectivity',
  domain: '',
  category_code: '',
  since: lastMonthToday,
  until: tomorrow,
  axis_x: 'measurement_start_day',
  axis_y: ''
}

export const Form = ({ onSubmit, testNames, query }) => {
  const intl = useIntl()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const defaultValues = Object.assign({}, defaultDefaultValues, query)
  const { handleSubmit, control, getValues, watch } = useForm({
    defaultValues
  })

  const sortedCountries = countryList
    .sort((a,b) => (a.iso3166_name < b.iso3166_name) ? -1 : (a.iso3166_name > b.iso3166_name) ? 1 : 0)

  const testNameValue = watch('test_name')
  const showDomainField = isValidFilterForTestname(testNameValue, testsWithValidDomainFilter)
  const showCategoriesField = isValidFilterForTestname(testNameValue, testsWithValidDomainFilter)

  const isValidSinceDate = useCallback((currentDate) => {
    const current = dayjs(currentDate)
    const until = dayjs(getValues('until'))
    if (until.isValid()) {
      const oneYearBack = until.subtract(1, 'year')
      return current.isBetween(oneYearBack, until, 'day', '[]')
    } else {
      return current.isBefore(tomorrow)
    }
  }, [getValues])

  const isValidUntilDate = useCallback((currentDate) => {
    const current = dayjs(currentDate)
    const since = dayjs(getValues('since'))
    if (since.isValid()) {
      const oneYearAfterSince = since.add(1, 'year')
      return current.isBetween(since, oneYearAfterSince, 'day', '[]') && current.isSameOrBefore(tomorrow)
    } else {
      return current.isSameOrBefore(tomorrow)
    }
  }, [getValues])

  const onConfirm = useCallback((e) => {
    setShowConfirmation(false)
    handleSubmit(onSubmit)(e)
  }, [handleSubmit, onSubmit])

  const onCancel = useCallback((e) => {
    setShowConfirmation(false)
    e.preventDefault()
  }, [])

  const maybeWarnBeforeSubmit = useCallback((e) => {
    e.preventDefault()

    const [since, until] = getValues(['since', 'until'])
    const isDurationMoreThanThresold = (dayjs(until).diff(dayjs(since), 'month')) > THRESHOLD_IN_MONTHS

    if (isDurationMoreThanThresold) {
      setShowConfirmation(true)
    } else {
      // Otherwise just continue with submission without interruption
      onConfirm(e)
    }
  }, [getValues, onConfirm])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ConfirmationModal show={showConfirmation} onConfirm={onConfirm} onCancel={onCancel} />
      <Flex my={2} alignItems='center' flexDirection={['column', 'row']}>
        <Box width={[1, 2/8]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='Search.Sidebar.Country' />
          </StyledLabel>
          <Controller
            render={({field}) => (
              <Select {...field} width={1}>
                <option value=''>All Countries</option>
                {sortedCountries.map((c, idx) =>(
                  <option key={idx} value={c.iso3166_alpha2}>{c.iso3166_name}</option>
                ))}
              </Select>
            )}
            name='probe_cc'
            control={control}
          />
        </Box>
        <Box width={[1, 1/8]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='Search.Sidebar.ASN' />
          </StyledLabel>
          <Controller
            name='probe_asn'
            control={control}
            render={({field}) => (
              <Input
                placeholder='AS1234'
                {...field}
              />
            )}
          />
        </Box>
        <Box width={[1, 1/8]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='Search.Sidebar.From' />
          </StyledLabel>
          <Controller
            name='since'
            control={control}
            render={({field: {onChange}}) => (
              <DatePicker
                defaultValue={defaultValues.since}
                dateFormat='YYYY-MM-DD'
                utc={true}
                timeFormat={false}
                onChange={(date) =>
                  onChange(moment.isMoment(date)
                    ? date.format('YYYY-MM-DD')
                    : date
                  )
                }
                isValidDate={isValidSinceDate}
              />
            )}
          />
        </Box>
        <Box width={[1, 1/8]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='Search.Sidebar.Until' />
          </StyledLabel>
          <Controller
            name='until'
            control={control}
            render={({field: {onChange}}) => (
              <DatePicker
                defaultValue={defaultValues.until}
                dateFormat='YYYY-MM-DD'
                utc={true}
                timeFormat={false}
                onChange={(date) =>
                  onChange(moment.isMoment(date)
                    ? date.format('YYYY-MM-DD')
                    : date
                  )
                }
                isValidDate={isValidUntilDate}
              />
            )}
          />
        </Box>
        <Box width={[1, 1/8]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='MAT.Form.Label.XAxis' />
          </StyledLabel>
          <Controller
            name='axis_x'
            control={control}
            render={({field}) => (
              <Select {...field} width={1}>
                {xAxisOptions.map((option, idx) => (
                  <option key={idx} value={option}>{option.length > 0 ? intl.formatMessage(messages[option]) : option}</option>
                ))}
              </Select>
            )}
          />
        </Box>
        <Box width={[1, 1/8]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='MAT.Form.Label.YAxis' />
          </StyledLabel>
          <Controller
            name='axis_y'
            control={control}
            render={({field}) => (
              <Select {...field} width={1}>
                {yAxisOptions.map((option, idx) => (
                  <option key={idx} value={option}>{option.length > 0 ? intl.formatMessage(messages[option]) : option}</option>
                ))}
              </Select>
            )}
          />
        </Box>
      </Flex>
      <Flex my={2} flexDirection={['column', 'row']}>
        <Box width={[1, 1/5]} mx={[0, 2]}>
          <StyledLabel>
            <FormattedMessage id='Search.Sidebar.TestName' />
          </StyledLabel>
          <Controller
            name='test_name'
            control={control}
            render={({field}) => (
              <Select {...field} width={1}>
                {testNames.map((test, idx) => (
                  <option key={idx} value={test.id}>{test.name}</option>
                ))}
              </Select>
            )}
          />
        </Box>
        {showDomainField &&
          <Box width={[1, 1/5]} mx={[0, 2]}>
            <StyledLabel>
              <FormattedMessage id='Search.Sidebar.Domain' />
            </StyledLabel>
            <Controller
              name='domain'
              control={control}
              render={({field}) => (
                <Input
                  placeholder='twitter.com'
                  {...field}
                />
              )}
            />
          </Box>
        }
        {showCategoriesField &&
          <Box width={[1, 1/5]} mx={[0, 2]}>
            <StyledLabel>
              <FormattedMessage id='Search.Sidebar.Categories' />
            </StyledLabel>
            <Controller
              name='category_code'
              control={control}
              render={({field}) => (
                <Select {...field}>
                  <option value="">ALL</option>
                  {categoryCodes
                    .sort((a, b) => a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0)
                    .map(([code, label], idx) => (
                      <option key={idx} value={code}>{label}</option>
                  ))}
                </Select>
              )}
            />
          </Box>
        }
      </Flex>
      <Flex my={4}>
        <Button width={[1, 1/8]} onClick={maybeWarnBeforeSubmit}><FormattedMessage id='MAT.Form.Submit' /></Button>
      </Flex>

    </form>
  )
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  testNames: PropTypes.array,
  query: PropTypes.shape({
    axis_x: PropTypes.string,
    axis_y: PropTypes.string,
    since: PropTypes.string,
    until: PropTypes.string,
    test_name: PropTypes.string,
    domain: PropTypes.string,
    probe_cc: PropTypes.string,
    category_code: PropTypes.string,
  })
}
