/* global require */
import React from 'react'
import Head from 'next/head'

import moment from 'moment'
import NoSSR from 'react-no-ssr'

import MdPublic from 'react-icons/lib/md/public'
import MdPhonelink from 'react-icons/lib/md/phonelink'
import MdRestore from 'react-icons/lib/md/restore'

import styled from 'styled-components'

import axios from 'axios'

import {
  Flex, Box,
  Container,
  Heading,
  Text
} from 'ooni-components'

import { testGroups, testNames } from '../components/test-info'
import Badge from '../components/badge'

import NavBar from '../components/nav-bar'
import Layout from '../components/layout'

// We wrap the json viewer so that we can render it only in client side rendering
class JsonViewer extends React.Component {
  render() {
    const ReactJson = require('react-json-view').default
    const {
      src
    } = this.props
    return (
      <ReactJson src={src} />
    )
  }
}

const getTestMetadata = (testName) => {
  let metadata = {
    'name': testName,
    'groupName': testGroups.default.name,
    'color': testGroups.default.color,
    'icon': testGroups.default.icon
  }

  const test = testNames[testName]
  if (test === undefined) {
    return metadata
  }
  const group = testGroups[test.group]
  metadata['name'] = test.name
  metadata['groupName'] = group.name
  metadata['icon'] = group.icon
  metadata['color'] = group.color
  return metadata
}

const TestMetadataContainer =  styled.div`
  background-color: ${props => props.color };
  color: white;
`

const TestGroupBadge = ({icon, name, color}) => {
  return <Badge bg='white' color={color}>
    {icon} {name}
  </Badge>
}

const VerticalDivider = styled.div`
  background-color: white;
  height: 100%;
  width: 1px;
  margin-left: 10px;
  margin-right: 10px;
`

const TestMetadata = ({
  countryCode,
  metadata,
  startTime,
  runtime,
  platform,
  network
}) => {
  return <TestMetadataContainer color={metadata.color}>
    <Container>
      <Flex pb={3}>
        <Box w={1/2}>
          <Text>{countryCode}</Text>
          <Flex align='center'>
            <Box pr={3}>
              <Heading h={2}>{metadata.name}</Heading>
            </Box>
            <Box>
              <TestGroupBadge
                icon={metadata.icon}
                name={metadata.groupName}
                color={metadata.color}
              />
            </Box>
          </Flex>
          <Text>{moment(startTime).format('lll')}</Text>
        </Box>
        <Box>
          <VerticalDivider />
        </Box>
        <Box w={1/2}>
          <Flex wrap>
            {/* XXX Probably refactor these into a component */}
            <Box w={1/3} style={{flexGrow: '1'}} pb={2}>
              <Text><MdPublic />{' '}Network:</Text>
            </Box>
            <Box w={2/3} style={{flexGrow: '1'}}>
              {network}
            </Box>
            <Box w={1/3} style={{flexGrow: '1'}} pb={2}>
              <Text><MdPhonelink />{' '}Platform:</Text>
            </Box>
            <Box w={2/3} style={{flexGrow: '1'}}>
              {platform}
            </Box>
            <Box w={1/3} style={{flexGrow: '1'}} pb={2}>
              <Text><MdRestore />{' '}Runtime:</Text>
            </Box>
            <Box w={2/3} style={{flexGrow: '1'}}>
              {runtime}
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Container>
  </TestMetadataContainer>
}

export default class Measurement extends React.Component {

  static async getInitialProps ({ query }) {
    let initialProps = {}
    let client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    let params = {
      report_id: query.report_id
    }
    if (query.input) {
      params['input'] = query.input
    }
    let [msmtResult, countriesR] = await Promise.all([
      client.get('/api/v1/measurements', {
        params
      }),
      client.get('/api/_/countries')
    ])
    if (msmtResult.data.results.length > 0) {
      const measurementUrl = msmtResult.data.results[0].measurement_url
      if (msmtResult.data.results.length > 1) {
        initialProps['warning'] = 'dupes'
      }
      let msmtContent = await client.get(measurementUrl)
      initialProps['measurement'] = msmtContent.data
      let countries = countriesR.data.countries
      const { name: country } = countries.find(c =>
        c.alpha_2 === msmtContent.data.probe_cc
      )
      initialProps['country'] = country
    }
    return initialProps
  }

  constructor(props) {
    super(props)
  }

  render () {
    let {
      measurement,
      country
    } = this.props

    const tstMetadata = getTestMetadata(measurement.test_name)

    return (
      <Layout>
        <Head>
          <title>OONI Explorer</title>
        </Head>

        <NavBar color={tstMetadata.color} />

        <TestMetadata
          countryCode={measurement.probe_cc}
          startTime={measurement.test_start_time}
          network={measurement.probe_asn}
          platform={measurement.software_name}
          runtime={measurement.test_runtime}
          metadata={tstMetadata} />

        <Container>

          <Heading h={4}>Raw Measurement Data</Heading>

          <NoSSR>
            <JsonViewer src={measurement} />
          </NoSSR>
        </Container>
      </Layout>
    )
  }
}
