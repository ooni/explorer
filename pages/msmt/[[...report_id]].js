import React from 'react'
import axios from 'axios'
import Layout from 'components/Layout'
import Head from 'next/head'
import { Container, theme } from 'ooni-components'
import Hero from '../../components/measurement/Hero'
import CommonSummary from '../../components/measurement/CommonSummary'
import DetailsHeader from '../../components/measurement/DetailsHeader'
import SummaryText from '../../components/measurement/SummaryText'
import CommonDetails from '../../components/measurement/CommonDetails'
import MeasurementContainer from '../../components/measurement/MeasurementContainer'
import HeadMetadata from '../../components/measurement/HeadMetadata'
import NavBar from '../../components/NavBar'
import countryUtil from 'country-util'

const pageColors = {
  default: theme.colors.base,
  anomaly: theme.colors.yellow9,
  reachable: theme.colors.green8,
  error: theme.colors.gray6,
  down: theme.colors.gray6,
  confirmed: theme.colors.red7
}

const MeasurementPage = (props) => {
  const {
    errors,
    country,
    confirmed,
    anomaly,
    failure,
    test_name,
    test_start_time,
    probe_cc,
    probe_asn,
    notFound = false,
    input,
    raw_measurement,
    report_id,
    ssrRequests,
    ...rest
  } = props

  console.log('Server side requests')
  console.log(ssrRequests)

  if (!raw_measurement)
  {
    return (
      <div> Cannot render without `raw_measurment`
        <pre> { JSON.stringify(props, null, 2)} </pre>
      </div>
    )
  }
  return (
    <Layout>
      <Head>
        <title>OONI Explorer</title>
      </Head>
        <MeasurementContainer
          isConfirmed={confirmed}
          isAnomaly={anomaly}
          isFailure={failure}
          testName={test_name}
          country={country}
          measurement={raw_measurement}
          input={input}
          test_start_time={test_start_time}
          probe_asn={probe_asn}
          {...rest}

          render={({
            status = 'default',
            statusIcon,
            statusLabel,
            statusInfo,
            legacy = false,
            summaryText,
            headMetadata,
            details
          }) => (
            <React.Fragment>
              {headMetadata &&
                <HeadMetadata
                  content={headMetadata}
                  testName={test_name}
                  testUrl={input}
                  country={country}
                  date={test_start_time}
                />
              }
              <NavBar color={pageColors[status]} />
              <Hero
                color={pageColors[status]}
                status={status}
                icon={statusIcon}
                label={statusLabel}
                info={statusInfo}
              />
              <CommonSummary
                test_start_time={test_start_time}
                probe_asn={probe_asn}
                probe_cc={probe_cc}
                color={pageColors[status]}
                country={country}
              />

              <Container>
                <DetailsHeader
                  testName={test_name}
                  runtime={raw_measurement?.test_runtime}
                  notice={legacy}
                  url={`measurement/${report_id}`}
                />
                {summaryText &&
                  <SummaryText
                    testName={test_name}
                    testUrl={input}
                    network={probe_asn}
                    country={country}
                    date={test_start_time}
                    content={summaryText}
                  />
                }
                {details}
                <CommonDetails
                  measurement={raw_measurement}
                  reportId={report_id}
                />
              </Container>
            </React.Fragment>
          )} />
    </Layout>
  )
}

export async function getServerSideProps({ query }) {
  console.log('getServerSideProps', query)
  let response
  let initialProps = { init: 0, notFound: false, ssrRequests: {} }
  const report_id = query.report_id[0]
  const client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL}) // eslint-disable-line
  let params = {
    report_id: report_id,
    full: true
  }
  if (query.input) {
    params['input'] = query.input
  }

  try {
    response = await client.get('/api/v1/measurement_meta', {
      params: params
    })

    if (response?.config) {
      const { url, method, headers, params, baseURL } = response?.config
      const responseUrl = response?.request?.res?.responseUrl
      const serverError = response?.data?.error ?? response?.message ?? 'nothing in `response.data.error` or `$exception.message`'
      initialProps.ssrRequests.config = { url, method, headers, params, baseURL, responseUrl, serverError }
    }

    initialProps = {...initialProps, ...response.data}
    initialProps['raw_measurement'] = JSON.parse(initialProps['raw_measurement'])
    initialProps['scores'] = JSON.parse(initialProps['scores'])

    const { probe_cc } = response.data
    const countryObj = countryUtil.countryList.find(country => (
      country.iso3166_alpha2 === probe_cc
    ))
    initialProps['country'] = countryObj?.name || 'Unknown'

    if (response?.config) {
      const { url, method, headers, params, baseURL } = response?.config
      const responseUrl = response?.request?.res?.responseUrl
      const serverError = response?.data?.error ?? response?.message ?? 'nothing in `response.data.error` or `$exception.message`'
      initialProps.ssrRequests.config = { url, method, headers, params, baseURL, responseUrl, serverError }
    }
  } catch (error) {
    console.error(error)
  }
  return {
    props: initialProps
  }
}

export default MeasurementPage
