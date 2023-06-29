import Head from 'next/head'
import NavBar from '../../components/NavBar'
import { Container, Heading, Input, Textarea, Label, Button, Flex, Box } from 'ooni-components'
import {
  useForm,
  useFieldArray,
  Controller,
  Control,
  FormProvider,
  useFormContext,
} from 'react-hook-form'
import { createIncidentReport } from '../../lib/api'
import { useIntl } from 'react-intl'
import { useState } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import { format } from 'date-fns'

const IncidentForm = ({ defaultValues, onSubmit }) => {
  const { handleSubmit, control, watch, setValue, getValues, formState } = useForm({
    defaultValues,
  })
  const { errors } = formState

  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleRangeSelect = (range) => {
    if (range?.from) {
      setValue('start_time', format(range.from, 'y-MM-dd'))
    } else {
      setValue('start_time', null)
    }
    if (range?.to) {
      setValue('end_time', format(range.to, 'y-MM-dd'))
    } else {
      setValue('end_time', null)
    }
    setShowDatePicker(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p>Title</p>
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <Input
            {...field}
            // label={intl.formatMessage({id: 'IncidentReport.Title'})}
            error={errors?.title?.message}
          />
        )}
      />

      <p>Author</p>
      <Controller
        control={control}
        name="reported_by"
        render={({ field }) => (
          <Input
            {...field}
            // label={intl.formatMessage({id: 'IncidentReport.ReportedBy'})}
            error={errors?.reported_by?.message}
          />
        )}
      />

      <p>Published</p>
      <Controller
        control={control}
        name="published"
        render={({ field }) => (
          <Label htmlFor="published" alignItems="center">
            <input {...field} type="checkbox" id="published" checked={field.value} />
          </Label>
        )}
      />

      <Flex flexDirection={['column', 'row']}>
        <Box width={1 / 2} pr={1}>
          <p>From</p>
          <Controller
            control={control}
            name="start_time"
            render={({ field }) => (
              <Input
                {...field}
                onFocus={() => setShowDatePicker(true)}
                onKeyDown={() => setShowDatePicker(false)}
                // label={intl.formatMessage({id: 'Search.Sidebar.From'})}
                id="start_time"
              />
            )}
          />
        </Box>
        <Box width={1 / 2} pl={1}>
          <p>Until</p>
          <Controller
            control={control}
            name="end_time"
            render={({ field }) => (
              <Input
                {...field}
                onFocus={() => setShowDatePicker(true)}
                onKeyDown={() => setShowDatePicker(false)}
                // label={intl.formatMessage({id: 'Search.Sidebar.Until'})}
                id="end_time"
              />
            )}
          />
        </Box>
      </Flex>
      {showDatePicker && (
        <DateRangePicker
          handleRangeSelect={handleRangeSelect}
          initialRange={{ from: getValues('start_time'), to: getValues('end_time') }}
          close={() => setShowDatePicker(false)}
        />
      )}

      <p>Text</p>
      <Controller
        control={control}
        name="text"
        render={({ field }) => (
          <Textarea
            {...field}
            // label={intl.formatMessage({id: 'IncidentReport.Text'})}
            error={errors?.title?.message}
          />
        )}
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}

export default IncidentForm
