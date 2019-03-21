import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Heading, theme } from 'ooni-components'
import styled from 'styled-components'
import axios from 'axios'
import MdArrowDropDownCircle from 'react-icons/lib/md/arrow-drop-down-circle'
import moment from 'moment'

import { inCountry } from './country-context'
import { testNames } from '../test-info'

const AppGroupHeading = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray3};
  border-left: 12px solid ${props => props.theme.colors.cyan6};
`

const StyledRow = styled(Flex)`
  border: 1px solid ${props => props.theme.colors.gray3};
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
      <React.Fragment>
        <AppGroupHeading mt={4} px={2}>
          <Heading h={5}>{title}</Heading>
        </AppGroupHeading>
        <Box>
          {Object.keys(data).map((im, index) => (
            <StyledRow key={index} px={2} py={3} alignItems='center'>
              <Box width={1/12}>
                <span>(icon)</span>
              </Box>
              <Box width={3/12}>
                {testNames[im].name}
              </Box>
              <Box width={4/12}>
                {`${data[im].anomaly_networks.length} / ${data[im].ok_networks.length} Networks`}
              </Box>
              <Box width={3/12}>
                <FormattedMessage id='Country.Apps.Label.LastTested' />
                {' '}
                <strong>{moment(data[im].last_tested).fromNow()}</strong>
              </Box>
              <Box width={1/12}>
                <MdArrowDropDownCircle size={19} />
              </Box>
            </StyledRow>
          ))}
        </Box>
      </React.Fragment>
    )
  }
}

export default inCountry(AppsStatsGroup)
