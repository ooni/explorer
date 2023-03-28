import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import NLink from 'next/link'
import {
  Flex,
  Container,
  Box,
  Text,
  Link,
} from 'ooni-components'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import { MdOutlineFactCheck } from 'react-icons/md'
import { BiShareAlt } from 'react-icons/bi'

import Flag from '../Flag'

const SummaryContainer = styled(Box)`
  background-color: ${props => props.color};
  color: white;
`

const StyledSummaryItemLabel = styled(Text)`
  font-weight: 600;
`

const CommonSummary = ({
  color,
  measurement_start_time,
  probe_asn,
  probe_cc,
  networkName,
  country,
  hero,
  onVerifyClick
}) => {
  const intl = useIntl()
  const startTime = measurement_start_time
  const network = probe_asn
  const countryCode = probe_cc
  const formattedDate = new Intl.DateTimeFormat(intl.locale, { dateStyle: 'long', timeStyle: 'long', timeZone: 'UTC' }).format(new Date(startTime))
  
  return (
    <>
      <SummaryContainer py={4} color={color} data-test-id='common-summary'>
        <Container>
          <Flex justifyContent='space-between'>
            <Box fontSize={1}>
              {formattedDate}
            </Box>
            <Box>
              <Flex sx={{gap: 14}}>
              {/* <Box>
                <Box fontSize={18} textAlign='center'><BiShareAlt /></Box>
                <Box fontSize={0} fontWeigh={600} textAlign='center'>{'Share'.toUpperCase()}</Box>
              </Box> */}
              <Box sx={{cursor: 'pointer'}} onClick={onVerifyClick}>
                <Box fontSize={18} textAlign='center'><MdOutlineFactCheck /></Box>
                <Box fontSize={0} fontWeigh={600} textAlign='center'>{intl.formatMessage({id: 'Measurement.CommonSummary.Verify'}).toUpperCase()}</Box>
              </Box>
              </Flex>
            </Box>
          </Flex>
          {hero}
          <Flex mt={2} sx={{textDecoration:'underline'}}>
            <Box width={[1, 1, 1/2]}>
              <NLink href={`/country/${countryCode}`} passHref><Link color='white'>
                <Flex alignItems='center'>
                  <Box mr={2}>
                    <Flag countryCode={countryCode} size={33} />
                  </Box>
                  <Box fontSize={2}>
                    {country}
                  </Box>
                </Flex>
              </Link></NLink>
              <Text fontSize={1}>
                <NLink href={`/network/${network}`} passHref>
                  <Link color='white'>
                    <Text mb={2} mt={2}>{network} {networkName}</Text>
                  </Link>
                </NLink>
              </Text>
            </Box>
          </Flex>
        </Container>
      </SummaryContainer>
    </>
  )
}

CommonSummary.propTypes = {
  measurement_start_time: PropTypes.string.isRequired,
  probe_asn: PropTypes.string.isRequired,
  probe_cc: PropTypes.string.isRequired,
  networkName: PropTypes.string,
  country: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
}

export default CommonSummary
