import { yupResolver } from '@hookform/resolvers/yup'
import {
  HtmlValidate,
  StaticConfigLoader,
  defineMetadata,
} from 'html-validate/browser'
import {
  Checkbox,
  Input,
  Modal,
  MultiSelect,
  MultiSelectCreatable,
  Textarea,
} from 'ooni-components'
import { useCallback, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { localisedCountries } from 'utils/i18nCountries'
import * as yup from 'yup'
import useUser from '../../hooks/useUser'
import FindingDisplay from './FindingDisplay'
import { testNames } from '/components/test-info'

const elements = [
  defineMetadata({
    MAT: {
      void: false,
      attributes: {
        link: {
          required: true,
          // boolean: false,
          // omit: false,
          enum: [/https:\/\/explorer.ooni.org\/chart\/mat\?\S*/],
        },
        caption: {
          boolean: false,
          omit: false,
        },
      },
    },
  }),
]

const loader = new StaticConfigLoader({
  rules: {
    'void-style': ['error', { style: 'selfclose' }],
    'void-content': 'error',
    'element-case': ['error', { style: 'uppercase' }],
    'element-name': ['error', { whitelist: ['MAT'] }],
    'attr-quotes': ['error', { style: 'auto', unquoted: false }],
    'element-required-attributes': 'error',
    'attribute-allowed-values': 'error',
    'attribute-boolean-style': 'error',
    'attribute-empty-style': 'error',
  },
  elements,
})

const htmlvalidate = new HtmlValidate(loader)

const schema = yup.object({
  title: yup.string().required(),
  email_address: yup.string().required(),
  reported_by: yup.string().required(),
  short_description: yup.string().required(),
  ASNs: yup.array().test({
    name: 'ASNsError',
    message: 'Only numeric values allowed',
    test: (val) => val.every((v) => !Number.isNaN(v.value)),
  }),
  start_time: yup.string().required(),
  end_time: yup
    .string()
    .nullable()
    .test({
      name: 'EndTimeError',
      message: 'Must be after start time',
      test: (val, testContext) => {
        if (val)
          return (
            new Date(testContext.parent.start_time).getTime() <
            new Date(val).getTime()
          )
        return true
      },
    }),
  text: yup
    .string()
    .required()
    .test({
      test: async (value, context) => {
        const validation = await htmlvalidate.validateString(value)
        if (!validation.valid) {
          const message = validation.results
            .map((obj) => obj.messages.map((m) => m.message).join(', '))
            .join(', ')
          return context.createError({ message, path: 'text' })
        }
        return true
      },
    }),
})

const Form = ({ defaultValues, onSubmit }) => {
  const intl = useIntl()
  const { user } = useUser()

  const themeOptions = useMemo(() => [
    {
      value: 'theme-human_rights',
      label: intl.formatMessage({ id: 'Findings.Themes.Options.HumanRights' }),
    },
    {
      value: 'theme-social_media',
      label: intl.formatMessage({ id: 'Findings.Themes.Options.SocialMedia' }),
    },
    {
      value: 'theme-im',
      label: intl.formatMessage({ id: 'Findings.Themes.Options.IM' }),
    },
    {
      value: 'theme-news_media',
      label: intl.formatMessage({ id: 'Findings.Themes.Options.NewsMedia' }),
    },
  ])

  defaultValues = {
    ...defaultValues,
    CCs: defaultValues.CCs.map((cc) => {
      const ccObj = localisedCountries(intl.locale).find(
        (co) => co.iso3166_alpha2 === cc,
      )
      return {
        label: ccObj.localisedCountryName,
        value: ccObj.iso3166_alpha2,
      }
    }),
    test_names: defaultValues.test_names.map((tn) => ({
      label: testNames[tn] ? intl.formatMessage({ id: testNames[tn].id }) : tn,
      value: tn,
    })),
    tags: defaultValues.tags
      .filter((t) => !t.includes('theme-'))
      .map((t) => ({ label: t, value: t })),
    themes: defaultValues.tags
      .filter((t) => t.includes('theme-'))
      .map((tn) => ({
        label: themeOptions.find((t) => t.value === tn)?.label || tn,
        value: tn,
      })),
    ASNs: defaultValues.ASNs.map((as) => ({ label: as, value: as })),
    domains: defaultValues.domains.map((d) => ({ label: d, value: d })),
  }

  const { handleSubmit, control, getValues, formState } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  })
  const { errors } = formState
  const [showPreview, setShowPreview] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const testNamesOptions = Object.entries(testNames).map(([k, v]) => ({
    value: k,
    label: intl.formatMessage({ id: v.id }),
  }))

  const sortedCountries = localisedCountries(intl.locale)
    .sort((a, b) =>
      new Intl.Collator(intl.locale).compare(
        a.localisedCountryName,
        b.localisedCountryName,
      ),
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

  const submit = (incident) => {
    console.log(incident)
    const tags = [...incident.tags, ...incident.themes]
    return onSubmit({
      ...incident,
      start_time: `${incident.start_time}T00:00:00Z`,
      ...(incident.end_time
        ? { end_time: `${incident.end_time}T00:00:00Z` }
        : { end_time: null }),
      test_names: incident.test_names.length
        ? incident.test_names.map((test_name) => test_name.value)
        : [],
      CCs: incident.CCs.length ? incident.CCs.map((cc) => cc.value) : [],
      tags: tags.length ? tags.map((t) => t.value) : [],
      ASNs: incident.ASNs.length
        ? incident.ASNs.map((as) => Number(as.value))
        : [],
      domains: incident.domains.length
        ? incident.domains.map((d) => d.value)
        : [],
    })
  }

  return (
    <>
      <Modal
        className="w-full max-w-[1000px]"
        show={showPreview}
        onHideClick={() => setShowPreview(!showPreview)}
      >
        <div className="p-8">
          <FindingDisplay incident={getPreviewValues()} />
        </div>
      </Modal>
      <form
        onSubmit={(e) =>
          handleSubmit(submit)(e).catch((e) => setSubmitError(e.message))
        }
      >
        {user?.role === 'admin' && (
          <div className="mb-4">
            <Controller
              control={control}
              name="published"
              render={({ field }) => (
                <Checkbox
                  {...field}
                  label={intl.formatMessage({
                    id: 'Findings.Form.Published.Label',
                  })}
                  checked={field.value}
                />
              )}
            />
          </div>
        )}
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              className="mb-4 required"
              {...field}
              label={intl.formatMessage({ id: 'Findings.Form.Title.Label' })}
              error={errors?.title?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="reported_by"
          render={({ field }) => (
            <Input
              className="mb-4 required"
              {...field}
              label={intl.formatMessage({ id: 'Findings.Form.Author.Label' })}
              error={errors?.reported_by?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email_address"
          render={({ field }) => (
            <Input
              className="mb-4 required [&>input]:bg-gray-200"
              {...field}
              label={intl.formatMessage({
                id: 'Findings.Form.EmailAddress.Label',
              })}
              error={errors?.email_address?.message}
              disabled
            />
          )}
        />
        <div className="flex flex-col md:flex-row mb-4">
          <div className="w-1/2 pr-1">
            <Controller
              control={control}
              name="start_time"
              render={({ field }) => (
                <Input
                  {...field}
                  type="date"
                  label={intl.formatMessage({
                    id: 'Findings.Form.StartTime.Label',
                  })}
                  id="start_time"
                  error={errors?.start_time?.message}
                />
              )}
            />
          </div>
          <div className="w-1/2 pl-1">
            <Controller
              control={control}
              name="end_time"
              render={({ field }) => (
                <Input
                  {...field}
                  type="date"
                  error={errors?.end_time?.message}
                  label={intl.formatMessage({
                    id: 'Findings.Form.EndTime.Label',
                  })}
                  id="end_time"
                />
              )}
            />
          </div>
        </div>
        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <MultiSelectCreatable
              className="mb-4"
              {...field}
              label={intl.formatMessage({ id: 'Findings.Form.Tags.Label' })}
              components={{ DropdownIndicator: null }}
              menuIsOpen={false}
              placeholder={intl.formatMessage({
                id: 'Findings.Form.Tags.Placeholder',
              })}
            />
          )}
        />
        <Controller
          control={control}
          name="themes"
          render={({ field }) => (
            <MultiSelect
              className="mb-4"
              {...field}
              label={intl.formatMessage({ id: 'Findings.Form.Themes.Label' })}
              options={themeOptions}
            />
          )}
        />
        <Controller
          control={control}
          name="test_names"
          render={({ field }) => (
            <MultiSelectCreatable
              className="mb-4"
              {...field}
              options={testNamesOptions}
              label={intl.formatMessage({
                id: 'Findings.Form.TestNames.Label',
              })}
            />
          )}
        />
        <Controller
          control={control}
          name="CCs"
          render={({ field }) => (
            <MultiSelect
              {...field}
              className="mb-4"
              options={sortedCountries}
              label={intl.formatMessage({ id: 'Navbar.Countries' })}
            />
          )}
        />
        <Controller
          control={control}
          name="ASNs"
          error={errors?.ASNs?.message}
          render={({ field }) => (
            <MultiSelectCreatable
              {...field}
              menuIsOpen={false}
              components={{ DropdownIndicator: null }}
              className="mb-4"
              label={intl.formatMessage({ id: 'Findings.Form.ASNs.Label' })}
              placeholder={intl.formatMessage({
                id: 'Findings.Form.ASNs.Placeholder',
              })}
              error={errors?.ASNs?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="domains"
          render={({ field }) => (
            <MultiSelectCreatable
              {...field}
              className="mb-4"
              label={intl.formatMessage({ id: 'Navbar.Domains' })}
              placeholder={intl.formatMessage({
                id: 'Findings.Form.Domains.Placeholder',
              })}
            />
          )}
        />
        <Controller
          control={control}
          name="short_description"
          render={({ field }) => (
            <Input
              className="mb-4"
              {...field}
              error={errors?.short_description?.message}
              label={intl.formatMessage({
                id: 'Findings.Form.ShortDescription.Label',
              })}
            />
          )}
        />
        <Controller
          control={control}
          name="text"
          render={({ field }) => (
            <Textarea
              className="mb-4 required [&>textarea]:min-h-[500px]"
              {...field}
              label={intl.formatMessage({ id: 'Findings.Form.Text.Label' })}
              error={errors?.text?.message}
            />
          )}
        />
        <button
          className="btn btn-primary-hollow mr-3"
          type="button"
          onClick={() => setShowPreview(true)}
        >
          {intl.formatMessage({ id: 'Findings.Edit.ShowPreview' })}
        </button>
        <button className="btn btn-primary" type="submit">
          {intl.formatMessage({ id: 'General.Submit' })}
        </button>
        {submitError && (
          <div className="mt-4 text-red-600">
            {intl.formatMessage({ id: 'Measurement.Feedback.Failure' })}
            <br />
            Error: {submitError}
          </div>
        )}
      </form>
    </>
  )
}

export default Form
