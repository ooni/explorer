import React from 'react'
import { Flex, Box, Input } from 'ooni-components'
import { useForm, Controller } from 'react-hook-form'
import moment from  'moment'

import DatePicker from '../../DatePicker'


const Form = ({ onSubmit, initialValues }) => {
  const { handleSubmit, register, control, errors } = useForm({
    defaultValues: initialValues
  })

  const beforeSubmit = (values) => {
    const ret = Object.assign({}, values)

    for (const d of ['since', 'until']) {
      if(moment.isMoment(values[d])) {
        ret[d] = values[d].format('YYYY-MM-DD')
      }
    }

    return onSubmit(ret)
  }

  return (
    <form onSubmit={handleSubmit(beforeSubmit)}>
      <Flex justifyContent='space-around' mt={3}>
        <Box width={1/2} px={2}>
          <Controller
            as={
              <Input
                name='input'
                placeholder='e.g ooni.org'
                ref={register({ required: true })}
              />
            }
            name='input'
            control={control}
          />
        </Box>
        <Box width={1/2} px={2}>
          <Flex justifyContent='space-around'>
            <Controller
              as={
                <DatePicker
                  name='since'
                  onChange={() => {}}
                  dateFormat='YYYY-MM-DD'
                  utc={true}
                  timeFormat={false}
                  ref={register}
                />
              }
              name='since'
              control={control}
              defaultValue={moment().subtract(1, 'months')}
            />
            <Controller
              as={
                <DatePicker
                  name='until'
                  onChange={() => {}}
                  dateFormat='YYYY-MM-DD'
                  utc={true}
                  timeFormat={false}
                  ref={register}
                />
              }
              name='until'
              control={control}
              defaultValue={moment()}
            />
          </Flex>
        </Box>
        <button>Done</button>
      </Flex>
    </form>
  )
}

export default Form
