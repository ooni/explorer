import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import styled from 'styled-components'
import {
  Flex, Box,
  Label, Input, Select, Button
} from 'ooni-components'

import categoryCodes from './category_codes.json'

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
  const { register, handleSubmit, control, errors } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <Flex flexWrap='wrap'>
        <Box width={1/3}>
          <StyledLabel>
            Country
          </StyledLabel>
          <input name="probe_cc" ref={register} />
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
          <input name="since" defaultValue='2020-05-01' ref={register} />
        </Box>
        <Box width={1/3}>
          <StyledLabel>
            Until
          </StyledLabel>
          <input name="until" defaultValue='2020-06-01' ref={register} />
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
