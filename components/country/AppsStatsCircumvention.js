import React from 'react'
import { Box, Heading } from 'ooni-components'
import styled from 'styled-components'
import axios from 'axios'

import { inCountry } from './CountryContext'
import AppsStatsRowCircumvention from './AppsStatsCircumventionRow'
import { AppSectionLoader } from './WebsiteChartLoader'
import { axiosPluginLogRequest } from 'components/axios-plugins'

const AppGroupHeading = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray3};
  border-left: 12px solid ${props => props.theme.colors.cyan6};
`

const defaultState = {
  data: null,
  fetching: true
}

class AppsStatsCircumvention extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fetching: false,
      ...defaultState
    }
  }

  componentDidMount() {
    this.fetchCircumventionStats()
  }

  async fetchCircumventionStats() {
    const { countryCode } = this.props
    const client = axios.create({baseURL: process.env.NEXT_PUBLIC_MEASUREMENTS_URL}) // eslint-disable-line
    axiosPluginLogRequest(client)
    const result = await client.get('/api/_/vanilla_tor_stats', {
      params: {
        probe_cc: countryCode
      }
    })

    this.setState({
      data: result.data,
      fetching: false
    })
  }

  static getDerivedStateFromprops() {
    return defaultState
  }

  render() {
    const { title } = this.props
    const { data, fetching } = this.state

    if (fetching) {
      return (
        <AppSectionLoader rows={1} />
      )
    }

    return (
      <Box my={4}>
        <AppGroupHeading mt={4} px={2}>
          <Heading h={5}>{title}</Heading>
        </AppGroupHeading>
        <AppsStatsRowCircumvention data={data}/>
      </Box>
    )
  }
}

export default inCountry(AppsStatsCircumvention)
