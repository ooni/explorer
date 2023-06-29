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
import IncidentForm from '../../components/reports/form'

const defaultValues = {
  reported_by: null,
  title: null,
  text: null,
  published: false,
  start_time: null,
  end_time: null,
  tags: [],
  CCs: [],
  ASNs: [],
  links: [],
  domains: [],
  event_type: 'incident',
}

const CreateReport = () => {
  const intl = useIntl()

  const onSubmit = (report) => {
    createIncidentReport(report)
  }

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1}>Create Report</Heading>
        <IncidentForm onSubmit={onSubmit} defaultValues={defaultValues} />
      </Container>
    </>
  )
}

export default CreateReport
