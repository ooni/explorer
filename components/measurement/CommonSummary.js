import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Flex,
  Container,
  Box,
  Text
} from 'ooni-components'
import moment from 'moment'
import prettyMs from 'pretty-ms'
import MdPublic from 'react-icons/lib/md/public'
import MdPhonelink from 'react-icons/lib/md/phonelink'
import MdRestore from 'react-icons/lib/md/restore'

import NavBar from '../nav-bar'
import Flag from '../flag'
import Badge from '../badge'
import { testGroups, testNames } from '../test-info'

const SummaryContainer = styled.div`
  background-color: ${props => props.color};
  color: white;
`

const VerticalDivider = styled.div`
  background-color: white;
  height: 80%;
  width: 1px;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
`

const TestGroupBadge = ({icon, name, color}) => (
  <Badge bg='white' color={color}>
    {icon} {name}
  </Badge>
)

TestGroupBadge.propTypes = {
  icon: PropTypes.element,
  name: PropTypes.string,
  color: PropTypes.string
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


const CommonSummary = ({
  measurement,
  country
}) => {
  const metadata = getTestMetadata(measurement.test_name)
  const countryCode = measurement.probe_cc
  const startTime = measurement.test_start_time
  const network = measurement.probe_asn
  const platform = measurement.annotations.platform
  const runtime = measurement.test_runtime

  return (
    <React.Fragment>
      <NavBar color={metadata.color} />
      <SummaryContainer color={metadata.color}>
        <Container>
          <Flex pb={3}>
            <Box width={1/2}>
              <Flex align='center'>
                <Box p={1}>
                  <Flag countryCode={countryCode} size={24} />
                </Box>
                <Box>
                  <Text>{country}</Text>
                </Box>
              </Flex>
              <Flex align='center' pb={2}>
                <Box pr={4}>
                  <Text f={3}>{metadata.name}</Text>
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
            <Box width={1/2} mt={3}>
              <Flex flexWrap='wrap'>
                <Box width={1/3} style={{flexGrow: '1'}} pb={2}>
                  <Text><MdPublic />{' '}Network:</Text>
                </Box>
                <Box width={2/3} style={{flexGrow: '1'}}>
                  {network}
                </Box>
                <Box width={1/3} style={{flexGrow: '1'}} pb={2}>
                  <Text><MdPhonelink />{' '}Platform:</Text>
                </Box>
                <Box width={2/3} style={{flexGrow: '1'}}>
                  {platform}
                </Box>
                <Box width={1/3} style={{flexGrow: '1'}} pb={2}>
                  <Text><MdRestore />{' '}Runtime:</Text>
                </Box>
                <Box width={2/3} style={{flexGrow: '1'}}>
                  {prettyMs(runtime * 1000)}
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Container>
      </SummaryContainer>
    </React.Fragment>
  )
}

CommonSummary.propTypes = {
  measurement: PropTypes.object.isRequired,
  country: PropTypes.string
}

export default CommonSummary
