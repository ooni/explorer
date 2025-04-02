import { format } from 'date-fns'
import { Input } from 'ooni-components'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'

import DateRangePicker from '../DateRangePicker'

const Form = ({ onSubmit, since, until }) => {
  const intl = useIntl()
  const initialLoad = useRef(false)

  const { control, getValues, watch, setValue, reset } = useForm({
    defaultValues: { since, until },
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // trigger submit only when the dates are valid
    if (
      initialLoad.current &&
      dayjs(updatedSince, 'YYYY-MM-DD', true).isValid() &&
      dayjs(updatedUntil, 'YYYY-MM-DD', true).isValid()
    ) {
      onSubmit({ since: updatedSince, until: updatedUntil })
    } else {
      initialLoad.current = true
    }
  }, [updatedSince, updatedUntil])

  return (
    <form>
      <div className="flex items-center">
        <div className="w-full md:w-1/2 xl:w-1/5">
          <div className="flex">
            <div className="w-2/3 mr-4">
              <Controller
                name="since"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={intl.formatMessage({ id: 'Search.Sidebar.From' })}
                    onFocus={() => setShowDatePicker(true)}
                    onKeyDown={() => setShowDatePicker(false)}
                  />
                )}
              />
            </div>
            <div className="w-2/3 mr-4">
              <Controller
                name="until"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={intl.formatMessage({ id: 'Search.Sidebar.Until' })}
                    onFocus={() => setShowDatePicker(true)}
                    onKeyDown={() => setShowDatePicker(false)}
                  />
                )}
              />
            </div>
          </div>
          {showDatePicker && (
            <DateRangePicker
              handleRangeSelect={handleRangeSelect}
              initialRange={{
                from: getValues('since'),
                to: getValues('until'),
              }}
              close={() => setShowDatePicker(false)}
            />
          )}
        </div>
      </div>
    </form>
  )
}

export default Form
