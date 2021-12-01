import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { Flex, Box, Input, Button, Label, Text } from 'ooni-components'
import { useForm, Controller } from 'react-hook-form'
import moment from  'moment'
import styled from 'styled-components'

import DatePicker from '../../DatePicker'

const ErrorMessage = styled(Text)`
  color: ${props => props.theme.colors.red7};
  font-size: 1;
  min-height: 20px;
  padding-top: 4px;
`
const Form = ({ onSubmit, initialValues }) => {
  const { handleSubmit, control, errors, watch, formState } = useForm({
    defaultValues: initialValues,
    mode: 'onBlur'
  })

  const { since, until } = watch(['since', 'until'])
  const { dirty, isValid, isSubmitting } = formState

  const beforeSubmit = (values) => {
    const ret = Object.assign({}, values)
    // reformat dates to YYYY-MM-DD
    for (const d of ['since', 'until']) {
      if(moment.isMoment(values[d])) {
        ret[d] = values[d].format('YYYY-MM-DD')
      }
    }
    return onSubmit(ret)
  }

  const isValidSinceDate = useCallback((value) => {
    const today = moment.utc()
    if (until.length !== 0) {
      return value.isBefore(until)
    } else {
      return value.isSameOrBefore(today)
    }
  }, [until])

  const isValidUntilDate = useCallback((value) => {
    const today = moment.utc()
    if (until.length !== 0) {
      return value.isAfter(since) && value.isSameOrBefore(today)
    } else {
      return value.isSameOrBefore(today)
    }
  }, [since, until.length])

  return (
    <form onSubmit={handleSubmit(beforeSubmit)}>
      <Flex flexDirection={['column', 'row']} justifyContent='space-around' alignItems='center' my={3}>
        <Box width={[1, 1/2]} px={2} my={[2, 2]}>
          <Label color='blue5'> Website </Label>
          <Controller
            render={({field}) => (
              <Input
                {...field}
                placeholder='e.g ooni.org'
              />
            )}
            name='input'
            control={control}
            rules={{
              required: 'required',
              pattern: {
                // eslint-disable-next-line no-useless-escape
                value: /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,7}(:[0-9]{1,5})?(\/)?$/,
                message: 'invalid domain format'
              }
            }}
          />
          <ErrorMessage>{errors.input && errors.input.message}</ErrorMessage>
        </Box>
        <Box width={[1, 1/2]} px={2} my={[2, 0]}>
          <Flex>
            <Box mr={2}>
              <Label color='blue5'> Since </Label>
              <Controller
                render={(field) => (
                  <DatePicker
                    {...field}
                    dateFormat='YYYY-MM-DD'
                    utc={true}
                    timeFormat={false}
                    isValidDate={isValidSinceDate}
                  />
                )}
                name='since'
                control={control}
                rules={{
                  required: 'cannot be empty'
                }}
              />
              <ErrorMessage>{errors.since && errors.since.message}</ErrorMessage>
            </Box>
            <Box>
              <Label color='blue5'> Until </Label>
              <Controller
                render={({field}) => (
                  <DatePicker
                    {...field}
                    dateFormat='YYYY-MM-DD'
                    utc={true}
                    timeFormat={false}
                    isValidDate={isValidUntilDate}
                  />
                )}
                name='until'
                control={control}
                rules={{
                  required: 'cannot be empty'
                }}
              />
              <ErrorMessage>{errors.until && errors.until.message}</ErrorMessage>
            </Box>
          </Flex>
        </Box>
        <Button width={[1, 'unset']} my={[2, 0]} disabled={!isValid || !dirty || isSubmitting}>Update</Button>
      </Flex>
    </form>
  )
}

Form.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func
}

export default Form
