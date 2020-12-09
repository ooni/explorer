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

import categoryCodes from './category_codes.json'
import DatePicker from '../../DatePicker'

const StyledLabel = styled(Label).attrs({
  fontSize: 2,
  my: 2,
  pt: 3,
  color: 'blue5',
})`
  text:
`

const optionsAxis = [
  'measurement_start_day',
  'domain',
  'category_code',
  'probe_cc',
  'probe_asn',
  ''
]

export const Form = ({ onSubmit }) => {
  const { register, handleSubmit, control, getValues } = useForm()
  const tomorrow = moment.utc().add(1, 'day').format('YYYY-MM-DD')
  const lastMonthtoday = moment.utc().subtract(30, 'day').format('YYYY-MM-DD')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <Flex flexWrap='wrap'>
        <Box width={1/3}>
          <StyledLabel>
            Country
          </StyledLabel>
          <Controller
            as={Select}
            name='probe_cc'
            control={control}
            defaultValue=''
          >
            <option value='XX'>All Countries</option>
            {countryList
              .sort((a,b) => a.iso3166_name > b.iso3166_name)
              .map((c, idx) =>(
                <option key={idx} value={c.iso3166_alpha2}>{c.iso3166_name}</option>
              ))
            }
          </Controller>
        </Box>
        <Box width={1/3}>
          <StyledLabel>
            ASN
          </StyledLabel>
          <input name="probe_asn" ref={register} />
        </Box>
        <Box width={1/3}>
          <StyledLabel>
            Test Name
          </StyledLabel>
          <input name="test_name" defaultValue='web_connectivity' ref={register} />
        </Box>
        <Box width={1/3}>
          <StyledLabel>
            Since
          </StyledLabel>
          <Controller
            name='since'
            control={control}
            render={({onChange}) => (
              <DatePicker
                defaultValue={lastMonthtoday}
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
        <Box width={1/3}>
          <StyledLabel>
            Until
          </StyledLabel>
          <Controller
            name='until'
            control={control}
            defaultValue={tomorrow}
            render={({onChange}) => (
              <DatePicker
                defaultValue={lastMonthtoday}
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
        <Box width={1/3}>
          <StyledLabel>
            Domain
          </StyledLabel>
          <input name="domain" ref={register} />
        </Box>
        <Box width={1/3}>
          <StyledLabel>
            Category Codes
          </StyledLabel>
          <Controller
            as={Select}
            name='category_code'
            control={control}
            defaultValue=""
          >
            <option value="">ALL</option>
            {categoryCodes.map((code, idx) => (
              <option key={idx} value={code}>{code}</option>
            ))}
          </Controller>
        </Box>
        <Box width={1/3}>
          <StyledLabel>
            X Axis
          </StyledLabel>
          <select name="axis_x" ref={register} defaultValue='measurement_start_day'>
            {optionsAxis.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        </Box>
        <Box width={1/3}>
          <StyledLabel>
            Y Axis
          </StyledLabel>
          <select name="axis_y" ref={register} defaultValue=''>
            {optionsAxis.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        </Box>
      </Flex>
      <Box width={1/3} my={4}>
        <Button type='submit' fontSize={2}>Submit</Button>
      </Box>
    </form>
  )
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired
}
