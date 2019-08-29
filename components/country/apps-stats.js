import React from 'react'
import { Box, Heading, Text } from 'ooni-components'
import styled from 'styled-components'
import axios from 'axios'
import { FormattedMessage } from 'react-intl'

import { inCountry } from './country-context'
import AppsStatRow from './apps-stats-row'
import SpinLoader from '../vendor/spin-loader'

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

  static getDerivedStateFromprops() {
    return defaultState
  }

  render() {
    const { title } = this.props
    const { data, fetching } = this.state
    if (fetching) {
      return (
        <SpinLoader />
      )
    }
    return (
      <Box my={4}>
        <AppGroupHeading mt={4} px={2}>
          <Heading h={5}>{title}</Heading>
        </AppGroupHeading>
        {data && Object.keys(data).length === 0 &&
          <Box my={4}>
            <Text fontSize={18} color='gray6'>
              <FormattedMessage id='Country.Label.NoData' />
            </Text>
          </Box>
        }
        {Object.keys(data).map((im, index) => (
          <AppsStatRow key={index} data={data[im]} app={im} />
        ))}
      </Box>
    )
  }
}

export default inCountry(AppsStatsGroup)
