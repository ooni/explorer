import { Input, Textarea, Button, Flex, Box, Checkbox, Modal, TagInput, MultiSelect} from 'ooni-components'
import { useForm, Controller } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useCallback, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { localisedCountries } from 'utils/i18nCountries'
import ReportDisplay from './ReportDisplay'
import { testNames } from '/components/test-info'
import useUser from '../../hooks/useUser'
import * as yup from 'yup'

const schema = yup
  .object({
    title: yup.string().required(),
    short_description: yup.string().required(),
    ASNs: yup.array().test({
      name: 'ASNsError',
      message: 'Only numbers allowed',
      test: (val) => val.every((v) => !isNaN(v.value)),
    }),
    end_time: yup.string().test({
      name: 'EndTimeError',
      message: 'Must be after start time',
      test: (val, testContext) => (new Date(testContext.parent.start_time).getTime() < new Date(val).getTime()),
    }),
  })

const Form = ({ defaultValues, onSubmit }) => {
  const intl = useIntl()
  const { user } = useUser()

  if (defaultValues.CCs.length) defaultValues = {
    ...defaultValues, 
    CCs: defaultValues.CCs.map((cc) => {
      const ccObj = localisedCountries(intl.locale).find((co) => (co.iso3166_alpha2 === cc))
      return {
        label: ccObj.localisedCountryName, 
        value: ccObj.iso3166_alpha2
      }
    }),
    test_names: defaultValues.test_names.map((tn) => ({
        label: intl.formatMessage({id: testNames[tn].id}), 
        value: tn
      }
    )),
    tags: defaultValues.tags.map((t) => ({label: t, value: t})),
    ASNs: defaultValues.ASNs.map((as) => ({label: as, value: as})),
    domains: defaultValues.domains.map((d) => ({label: d, value: d}))
  }

  const { handleSubmit, control, getValues, formState } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  })
  const { errors } = formState
  const [showPreview, setShowPreview] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const testNamesOptions = Object.entries(testNames).map(([k, v]) => ({
    value: k,
    label: intl.formatMessage({id: v.id}),
  }))

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
      tags: values.tags.length ? values.tags.map((t) => t.value) : [],
      ASNs: values.ASNs.length ? values.ASNs.map((as) => as.value) : [],
      domains: values.domains.length ? values.domains.map((d) => d.value) : [],
    }
  }, [getValues])

  const submit = (report) => {
    console.log(report)
    return onSubmit({
      ...report,
      start_time: `${report.start_time}:00Z`,
      ...(report.end_time ? { end_time: `${report.end_time}:00Z` } : {end_time: null}),
      test_names: report.test_names.length ? report.test_names.map((test_name) => test_name.value) : [],
      CCs: report.CCs.length ? report.CCs.map((cc) => cc.value) : [],
      tags: report.tags.length ? report.tags.map((t) => t.value) : [],
      ASNs: report.ASNs.length ? report.ASNs.map((as) => as.value) : [],
      domains: report.domains.length ? report.domains.map((d) => d.value) : [],
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
        {user.role === 'admin' &&
          <Box mb={3}>
            <Controller
              control={control}
              name="published"
              render={({ field }) => <Checkbox {...field} label="Published" checked={field.value} />}
            />
          </Box>
        }
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input mb={3} {...field} label="Title*" error={errors?.title?.message} />
          )}
        />
        <Controller
          control={control}
          name="reported_by"
          render={({ field }) => (
            <Input mb={3} {...field} label="Author*" error={errors?.reported_by?.message} />
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
                  required
                  type="datetime-local"
                  label="Start Time*"
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
                  type="datetime-local"
                  error={errors?.end_time?.message}
                  label="End Time"
                  id="end_time"
                />
              )}
            />
          </Box>
        </Flex>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => 
          <TagInput {...field} mb={3} label="Tags" placeholder="Press Enter to add tags" />
        }
        />
        <Controller
          control={control}
          name="test_names"
          render={({ field }) => <MultiSelect {...field} mb={3} options={testNamesOptions} label="Test Names" />}
        />
        <Controller
          control={control}
          name="CCs"
          render={({ field }) => <MultiSelect {...field} mb={3} options={sortedCountries} label="Countries" />}
        />
        <Controller
          control={control}
          name="ASNs"
          error={errors?.ASNs?.message}
          render={({ field }) => <TagInput {...field} mb={3} label="ASNs" placeholder="Press Enter to add ASNs" error={errors?.ASNs?.message} />}
        />
        <Controller
          control={control}
          name="domains"
          render={({ field }) => <TagInput {...field} mb={3} label="Domains" placeHolder="Press Enter to add domains" />}
        />
        <Controller
          control={control}
          name="short_description"
          render={({ field }) => (
            <Input mb={3} {...field} error={errors?.short_description?.message} label="Short Description*" />
          )}
        />
        <Controller
          control={control}
          name="text"
          render={({ field }) => (
            <Textarea
              {...field}
              label="Text*"
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
        <p>{submitError && <>{submitError}</>}</p>
      </form>
    </>
  )
}

export default Form
