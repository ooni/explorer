import React from 'react'
import PropTypes from 'prop-types'
import { useForm, Controller } from 'react-hook-form'
import styled from 'styled-components'
import {
  Flex, Box,
  Label, Input, Select, Button
} from 'ooni-components'
import { countryList } from 'country-util'
import moment from 'moment'

import { categoryCodes } from '../../utils/categoryCodes'
import DatePicker from '../../DatePicker'

export const StyledLabel = styled(Label).attrs({
  my: 2,
  color: 'blue5',
})`
`

const optionsAxis = [
  'measurement_start_day',
  'domain',
  'category_code',
  'probe_cc',
  'probe_asn',
  ''
]

const tomorrow = moment.utc().add(1, 'day').format('YYYY-MM-DD')
const lastMonthToday = moment.utc().subtract(30, 'day').format('YYYY-MM-DD')

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
  const defaultValues = Object.assign({}, defaultDefaultValues, query)
  const { handleSubmit, control, getValues } = useForm({
    defaultValues
  })
  const sortedCountries = countryList
    .sort((a,b) => (a.iso3166_name < b.iso3166_name) ? -1 : (a.iso3166_name > b.iso3166_name) ? 1 : 0)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex my={2} justifyContent='space-between' flexDirection={['column', 'row']}>
        <Box width={[1, 1/5]}>
          <StyledLabel>
            Country
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
        <Box width={[1, 1/5]}>
          <StyledLabel>
            ASN
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
        <Box width={[1, 1/5]}>
          <StyledLabel>
            Since
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
                isValidDate={currentDate => {
                  const untilValue = getValues('until')
                  if (untilValue && untilValue.length !== 0) {
                    return currentDate.isBefore(untilValue, 'day')
                  } else {
                    return currentDate.isBefore(tomorrow)
                  }
                }}
              />
            )}
          />
        </Box>
        <Box width={[1, 1/5]}>
          <StyledLabel>
            Until
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
                isValidDate={currentDate => {
                  const sinceFilter = getValues('since')
                  if (sinceFilter && sinceFilter.length !== 0) {
                    return currentDate.isAfter(sinceFilter) && currentDate.isSameOrBefore(tomorrow)
                  } else {
                    return currentDate.isSameOrBefore(tomorrow)
                  }
                }}
              />
            )}
          />
        </Box>
      </Flex>
      <Flex my={2} justifyContent='space-between' flexDirection={['column', 'row']}>
        <Box width={[1, 0.18]}>
          <StyledLabel>
            Test Name
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
        <Box width={[1, 0.18]}>
          <StyledLabel>
            Domain
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
        <Box width={[1, 0.18]}>
          <StyledLabel>
            Category Codes
          </StyledLabel>
          <Controller
            name='category_code'
            control={control}
            render={({field}) => (
              <Select {...field} width={1}>
                <option value="">ALL</option>
                {categoryCodes.map(([code, label], idx) => (
                  <option key={idx} value={code}>{label}</option>
                ))}
              </Select>
            )}
          />
        </Box>
        <Box width={[1, 0.18]}>
          <StyledLabel>
            X Axis
          </StyledLabel>
          <Controller
            name='axis_x'
            control={control}
            render={({field}) => (
              <Select {...field} width={1}>
                {optionsAxis.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </Select>
            )}
          />
        </Box>
        <Box width={[1, 0.18]}>
          <StyledLabel>
            Y Axis
          </StyledLabel>
          <Controller
            name='axis_y'
            control={control}
            render={({field}) => (
              <Select {...field} width={1}>
                {optionsAxis.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </Select>
            )}
          />
        </Box>
      </Flex>
      <Flex my={4}>
        <Button type='submit' width={[1, 1/8]}>Submit</Button>
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
