import React from 'react'
import { Box, Heading } from 'ooni-components'
import styled from 'styled-components'
import axios from 'axios'

import { inCountry } from './country-context'
import AppsStatRow from './apps-stats-row'

const AppGroupHeading = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray3};
  border-left: 12px solid ${props => props.theme.colors.cyan6};
`

const defaultState = {
  data: null,
  fetching: true
}

class AppsStatsGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fetching: false,
      ...defaultState
    }
  }

  componentDidMount() {
    this.fetchIMNetworks()
  }

  async fetchIMNetworks() {
    const { countryCode } = this.props
    const client = axios.create({baseURL: process.env.MEASUREMENTS_URL}) // eslint-disable-line
    const result = await client.get('/api/_/im_networks', {
      params: {
        probe_cc: countryCode
      }
    })

    this.setState({
      data: result.data,
      fetching: false
    })
  }

  static getDerivedStateFromprops(props, state) {
    return defaultState
  }

  render() {
    const { title } = this.props
    const { data, fetching } = this.state
    if (fetching) {
      return (
        <div> Loading ... </div>
      )
    }
    return (
      <Box my={4}>
        <AppGroupHeading mt={4} px={2}>
          <Heading h={5}>{title}</Heading>
        </AppGroupHeading>
        {Object.keys(data).map((im, index) => (
          <AppsStatRow key={index} data={data[im]} app={im} />
        ))}
      </Box>
    )
  }
}

export default inCountry(AppsStatsGroup)
