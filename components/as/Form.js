import { useEffect, useRef, useState, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, Button, Flex, Input } from 'ooni-components'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import { format } from 'date-fns'

import DateRangePicker from '../DateRangePicker'

const Form = ({ onSubmit, since, until }) => {
  const intl = useIntl()
  const initialLoad = useRef(false)

  const { control, getValues, watch, setValue, reset } = useForm({
    defaultValues: { since, until }
  })

  const { since: updatedSince, until: updatedUntil } = watch()

  const [showDatePicker, setShowDatePicker] = useState(false)
  const handleRangeSelect = (range) => {
    if (range?.from) {
      setValue('since', format(range.from, 'y-MM-dd'))
    } else {
      setValue('since', '')
    }
    if (range?.to) {
      setValue('until', format(range.to, 'y-MM-dd'))
    } else {
      setValue('until', '')
    }
    setShowDatePicker(false)
  }

  useEffect(() => {
    // trigger submit only when the dates are valid
    if (
      initialLoad.current && 
      dayjs(updatedSince, 'YYYY-MM-DD', true).isValid() &&
      dayjs(updatedUntil, 'YYYY-MM-DD', true).isValid()
    ) {
      onSubmit({since: updatedSince, until: updatedUntil})
    } else {
      initialLoad.current = true
    }
  }, [updatedSince, updatedUntil])

  return (
    <form>
      <Flex alignItems={['center']}>
        <Box width={[1, 1/5]}>
          <Flex>
            <Box width={2/3} mr={3}>
              <Controller
                name='since'
                control={control}
                render={({field}) => (
                  <Input
                    {...field}
                    label={intl.formatMessage({id: 'Search.Sidebar.From'})}
                    onFocus={() => setShowDatePicker(true)}
                    onKeyDown={() => setShowDatePicker(false)}
                  />
                )}
              />
            </Box>
            <Box width={2/3} mr={3}>
              <Controller
                name='until'
                control={control}
                render={({field}) => (
                  <Input
                    {...field}
                    label={intl.formatMessage({id: 'Search.Sidebar.Until'})}
                    onFocus={() => setShowDatePicker(true)}
                    onKeyDown={() => setShowDatePicker(false)}
                  />
                )}
              />
            </Box>
          </Flex>
          { showDatePicker &&
            <DateRangePicker
              handleRangeSelect={handleRangeSelect}
              initialRange={{from: getValues('since'), to: getValues('until')}}
              close={() => setShowDatePicker(false)}
            />
          }
        </Box>
      </Flex>
    </form>
  )
}

export default Form
