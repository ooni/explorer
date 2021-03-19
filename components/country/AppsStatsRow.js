import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Link, theme } from 'ooni-components'
import styled from 'styled-components'
import {
  NettestWhatsApp,
  NettestTelegram,
  NettestFacebookMessenger
} from 'ooni-components/dist/icons'
import moment from 'moment'

import { testNames } from '../test-info'
import AppsStatChart from './AppsStatsChart'
import { CountryContext } from './CountryContext'
import { CollapseTrigger } from '../CollapseTrigger'

const NETWORK_STATS_PER_PAGE = 4

const AppIcon = ({ app, size }) => {
  switch(app) {
  case 'whatsapp':
    return <NettestWhatsApp size={size} />
  case 'telegram':
    return <NettestTelegram size={size} />
  case 'facebook_messenger':
    return <NettestFacebookMessenger size={size} />
  default:
    return <React.Fragment />
  }
}

const StyledRow = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray3};
`

const NetworkRow = ({ asn, app }) => {
  const { countryCode } = useContext(CountryContext)
  const until = moment.utc().add(1, 'day').format('YYYY-MM-DD')
  const since = moment.utc().subtract(30, 'days').format('YYYY-MM-DD')

  const linkToMeasurements = `/search?probe_cc=${countryCode}&probe_asn=AS${asn}&test_name=${app}&since=${since}&until=${until}`

  return (
    <Box width={1}>
      <Flex
        my={3}
        flexWrap='wrap'
        flexDirection={['column', 'row']}
        alignItems={['flex-start', 'center']}
      >
        <Box width={[1, 1/3]}>
          <Flex flexWrap='wrap' flexDirection={['column']}>
            <Box>
              <strong>
                AS{ asn }
              </strong>
            </Box>
            <Box>
              <Link href={linkToMeasurements} color='blue7'>
                <FormattedMessage id='Country.Websites.URLCharts.ExploreMoreMeasurements' />
              </Link>
            </Box>
          </Flex>
        </Box>
        <Box width={[1, 2/3]} my={1}>
          <AppsStatChart asn={asn} app={app} />
        </Box>
      </Flex>
    </Box>
  )
}

class AppsStatRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      minimized: true,
      visibleNetworks: 0
    }
    this.toggleMinimize = this.toggleMinimize.bind(this)
    this.showMore = this.showMore.bind(this)
  }

  toggleMinimize() {
    const { totalNetworks } = this.state
    const networksToShow = Math.min(totalNetworks, NETWORK_STATS_PER_PAGE)
    this.setState((state) => ({
      minimized: !state.minimized,
      visibleNetworks: state.minimized ? networksToShow : 0
    }))
  }

  showMore() {
    // Ensure not to add more rows than available
    const { visibleNetworks, totalNetworks } = this.state

    let rowsToAdd = NETWORK_STATS_PER_PAGE

    if (visibleNetworks + NETWORK_STATS_PER_PAGE > totalNetworks) {
      rowsToAdd = totalNetworks - visibleNetworks
    }

    this.setState((state) => ({
      visibleNetworks: state.visibleNetworks + rowsToAdd
    }))
  }


  static getDerivedStateFromProps(props, state) {
    const totalNetworks = props.data.anomaly_networks.length + props.data.ok_networks.length
    return {
      totalNetworks,
      ...state
    }
  }

  renderCharts() {
    const { data, app } = this.props
    const { totalNetworks, visibleNetworks } = this.state
    const networks = [...data.anomaly_networks, ...data.ok_networks]
    const content = []

    for (let i = 0; i < networks.length && i < visibleNetworks ; i ++) {
      content.push(<NetworkRow key={networks[i].asn} asn={networks[i].asn} app={app} />)
    }

    return (
      <React.Fragment>
        <Flex flexWrap='wrap'>
          {content}
        </Flex>
        {(visibleNetworks < totalNetworks) &&
          <Flex justifyContent='center'>
            <Link color='blue7' href='#' onClick={(e) => {e.preventDefault(); this.showMore()}}>
              <FormattedMessage id='Country.Apps.Button.ShowMore' />
            </Link>
          </Flex>
        }
      </React.Fragment>
    )
  }

  render () {
    const { app, data } = this.props
    const { minimized } = this.state
    return (
      <StyledRow p={3}>
        <Flex flexWrap='wrap' alignItems='center'>
          <Box mr={3}>
            <AppIcon app={app} size={36} />
          </Box>
          <Box width={4/12}>
            {testNames[app].name}
          </Box>
          <Box ml='auto' width={4/12}>
            {`${data.anomaly_networks.length + data.ok_networks.length} Networks Tested`}
          </Box>
          <Box ml='auto'>
            <FormattedMessage id='Country.Apps.Label.LastTested' />
            {' '}
            <strong>{moment.utc(data.last_tested).fromNow()}</strong>
          </Box>
          <Box ml={4}>
            <CollapseTrigger
              size={36}
              $bg={theme.colors.gray3}
              $open={!minimized}
              onClick={this.toggleMinimize}
            />
          </Box>
        </Flex>
        {!minimized && this.renderCharts()}
      </StyledRow>
    )
  }
}

export default AppsStatRow
