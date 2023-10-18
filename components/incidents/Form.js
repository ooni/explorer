import { Input, Textarea, Button, Flex, Box, Checkbox, Modal, MultiSelectCreatable, MultiSelect} from 'ooni-components'
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
    email_address: yup.string().required(),
    reported_by: yup.string().required(),
    short_description: yup.string().required(),
    ASNs: yup.array().test({
      name: 'ASNsError',
      message: 'Only numbers allowed',
      test: (val) => val.every((v) => !isNaN(v.value)),
    }),
    start_time: yup.string().required(),
    end_time: yup.string().nullable().test({
      name: 'EndTimeError',
      message: 'Must be after start time',
      test: (val, testContext) => {
        if (val)
          return new Date(testContext.parent.start_time).getTime() < new Date(val).getTime()
        return true
      },
    }),
    text: yup.string().required().test({
      name: 'TextError',
      message: 'Contains invalid MAT url',
      test: (val) => {
        const regexp = /<(?:MAT.*link)=(?:"|')(?<link>[^"']*)(?:"|').*\/>/g
        const MATurlRegexp = /https:\/\/explorer\.ooni\.org\/chart\/mat\S*/
        const matches = [...val.matchAll(regexp)]
        return matches.every((match) => match[1].match(MATurlRegexp))
      },
    }),
  })

const Form = ({ defaultValues, onSubmit }) => {
  const intl = useIntl()
  const { user } = useUser()

  defaultValues = {
    ...defaultValues, 
    CCs: defaultValues.CCs.map((cc) => {
      const ccObj = localisedCountries(intl.locale).find((co) => (co.iso3166_alpha2 === cc))
      return {
        label: ccObj.localisedCountryName, 
        value: ccObj.iso3166_alpha2
      }
    }),
    test_names: defaultValues.test_names.map((tn) => ({
        label: testNames[tn] ? intl.formatMessage({id: testNames[tn].id}) : tn, 
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
        {user?.role === 'admin' &&
          <Box mb={3}>
            <Controller
              control={control}
              name="published"
              render={({ field }) => <Checkbox {...field} label={intl.formatMessage({ id: 'Incidents.Form.Published.Label' })} checked={field.value} />}
            />
          </Box>
        }
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input mb={3} {...field} className="required" label={intl.formatMessage({ id: 'Incidents.Form.Title.Label' })} error={errors?.title?.message} />
          )}
        />
        <Controller
          control={control}
          name="reported_by"
          render={({ field }) => (
            <Input mb={3} {...field} className="required" label={intl.formatMessage({ id: 'Incidents.Form.Author.Label' })} error={errors?.reported_by?.message} />
          )}
        />
        <Controller
          control={control}
          name="email_address"
          render={({ field }) => (
            <Input mb={3} bg="gray2" className="required" {...field} label={intl.formatMessage({ id: 'Incidents.Form.EmailAddress.Label' })} error={errors?.title?.message} disabled />
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
                  type="datetime-local"
                  label={intl.formatMessage({ id: 'Incidents.Form.StartTime.Label' })}
                  id="start_time"
                  error={errors?.start_time?.message}
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
                  label={intl.formatMessage({ id: 'Incidents.Form.EndTime.Label' })}
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
          <MultiSelectCreatable {...field} mb={3} label={intl.formatMessage({ id: 'Incidents.Form.Tags.Label' })} components={{ DropdownIndicator: null }} menuIsOpen={false} placeholder={intl.formatMessage({ id: 'Incidents.Form.Tags.Placeholder' })} />
        }
        />
        <Controller
          control={control}
          name="test_names"
          render={({ field }) => <MultiSelectCreatable {...field} mb={3} options={testNamesOptions} label={intl.formatMessage({ id: 'Incidents.Form.TestNames.Label' })} />}
        />
        <Controller
          control={control}
          name="CCs"
          render={({ field }) => <MultiSelect {...field} mb={3} options={sortedCountries} label={intl.formatMessage({ id: 'Navbar.Countries' })} />}
        />
        <Controller
          control={control}
          name="ASNs"
          error={errors?.ASNs?.message}
          render={({ field }) => <MultiSelectCreatable {...field}  menuIsOpen={false} components={{DropdownIndicator: null}} mb={3} label={intl.formatMessage({ id: 'Incidents.Form.ASNs.Label' })} placeholder={intl.formatMessage({ id: 'Incidents.Form.ASNs.Placeholder' })} error={errors?.ASNs?.message} />}
        />
        <Controller
          control={control}
          name="domains"
          render={({ field }) => <MultiSelectCreatable {...field} mb={3} label={intl.formatMessage({ id: 'Navbar.Domains' })} placeholder={intl.formatMessage({ id: 'Incidents.Form.Domains.Placeholder' })} />}
        />
        <Controller
          control={control}
          name="short_description"
          render={({ field }) => (
            <Input mb={3} {...field} error={errors?.short_description?.message} label={intl.formatMessage({ id: 'Incidents.Form.ShortDescription.Label' })} />
          )}
        />
        <Controller
          control={control}
          name="text"
          render={({ field }) => (
            <Textarea
              {...field}
              className="required"
              label={intl.formatMessage({ id: 'Incidents.Form.Text.Label' })}
              mb={3}
              minHeight={500}
              error={errors?.text?.message}
            />
          )}
        />
        <Button hollow mr={3} type="button" onClick={() => setShowPreview(true)}>
          {intl.formatMessage({id: 'Incidents.Edit.ShowPreview'})}
        </Button>
        <Button type="submit">{intl.formatMessage({id: 'General.Submit'})}</Button>
        <p>{submitError && <>{submitError}</>}</p>
      </form>
    </>
  )
}

export default Form
