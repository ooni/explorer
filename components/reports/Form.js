import { Input, Textarea, Button, Flex, Box, Checkbox, Modal, TagsInput, MultiSelect} from 'ooni-components'
import { useForm, Controller } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import DateRangePicker from '../DateRangePicker'
import { format } from 'date-fns'
import { localisedCountries } from 'utils/i18nCountries'
import ReportDisplay from './ReportDisplay'

const Form = ({ defaultValues, onSubmit }) => {
  const intl = useIntl()

  if (defaultValues.CCs.length) defaultValues = {
    ...defaultValues, 
    CCs: defaultValues.CCs.map((cc) => {
      const ccObj = localisedCountries(intl.locale).find((co) => (co.iso3166_alpha2 === cc))
      return {
        label: ccObj.localisedCountryName, 
        value: ccObj.iso3166_alpha2}
      }
    )
  }

  const { handleSubmit, control, watch, setValue, getValues, formState } = useForm({
    defaultValues,
  })
  const { errors } = formState
  const [showPreview, setShowPreview] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const sortedCountries = localisedCountries(intl.locale)
    .sort((a, b) =>
      new Intl.Collator(intl.locale).compare(a.localisedCountryName, b.localisedCountryName)
    )
    .map(({ iso3166_alpha2, localisedCountryName }) => ({
      value: iso3166_alpha2,
      label: localisedCountryName,
    }))

  const getPreviewValues = useCallback(() => {
    const values = getValues()
    return {
      ...values,
      CCs: values.CCs.length ? values.CCs.map((cc) => cc.value) : [],
    }
  }, [getValues])

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

  const submit = (report) => {
    return onSubmit({
      ...report,
      CCs: report.CCs.length ? report.CCs.map((cc) => cc.value) : [],
      ASNs: report.ASNs.length ? report.ASNs.filter((as) => !isNaN(as)).map((as) => Number(as)) : []
    })
  }

  return (
    <>
      <Modal
        show={showPreview}
        p={4}
        minWidth={1200}
        onHideClick={() => setShowPreview(!showPreview)}
      >
        <ReportDisplay report={getPreviewValues()} />
      </Modal>
      <form onSubmit={(e) => handleSubmit(submit)(e).catch((e) => setSubmitError(e.message))}>
        <Box mb={3}>
          <Controller
            control={control}
            name="published"
            render={({ field }) => <Checkbox {...field} label="Published" checked={field.value} />}
          />
        </Box>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input mb={3} {...field} label="Title" error={errors?.title?.message} />
          )}
        />
        <Controller
          control={control}
          name="reported_by"
          render={({ field }) => (
            <Input mb={3} {...field} label="Author" error={errors?.reported_by?.message} />
          )}
        />
        <Flex flexDirection={['column', 'row']} mb={3}>
          <Box width={1 / 2} pr={1}>
            <Controller
              control={control}
              name="start_time"
              render={({ field }) => (
                <Input
                  {...field}
                  onFocus={() => setShowDatePicker(true)}
                  onKeyDown={() => setShowDatePicker(false)}
                  label="Start Time"
                  id="start_time"
                />
              )}
            />
          </Box>
          <Box width={1 / 2} pl={1}>
            <Controller
              control={control}
              name="end_time"
              render={({ field }) => (
                <Input
                  {...field}
                  onFocus={() => setShowDatePicker(true)}
                  onKeyDown={() => setShowDatePicker(false)}
                  label="End Time"
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
        <Controller
          control={control}
          name="tags"
          render={({ field }) => <TagsInput {...field} mb={3} label="Tags" placeHolder="Press Enter to add tags" />}
        />
        <Controller
          control={control}
          name="CCs"
          render={({ field }) => <MultiSelect {...field} mb={3} options={sortedCountries} label="Countries" />}
        />
        <Controller
          control={control}
          name="ASNs"
          render={({ field }) => <TagsInput {...field} mb={3} label="ASNs" placeHolder="Press Enter to add ASNs" />}
        />
        <Controller
          control={control}
          name="Domains"
          render={({ field }) => <TagsInput {...field} mb={3} label="Domains" placeHolder="Press Enter to add domains" />}
        />
        <Controller
          control={control}
          name="text"
          render={({ field }) => (
            <Textarea
              {...field}
              label="Text"
              mb={3}
              minHeight={500}
              error={errors?.title?.message}
            />
          )}
        />
        <Button type="button" onClick={() => setShowPreview(true)}>
          Show Preview
        </Button>
        <Button type="submit">Submit</Button>
        {submitError && <>{submitError}</>}
      </form>
    </>
  )
}

export default Form
