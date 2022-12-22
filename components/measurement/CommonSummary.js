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

import Flag from '../Flag'

const SummaryContainer = styled(Box)`
  background-color: ${props => props.color};
  color: white;
`

const StyledSummaryItemLabel = styled(Text)`
  font-weight: 600;
`

const SummaryItemBox = ({
  label,
  content,
  link = null
}) => (
  <Box width={[1, 1/3]} px={4} py={2}>
    <Text fontSize={24} fontWeight={300}>
      {link ? <NLink href={link} passHref><Link color='white'>{content}</Link></NLink> : content}
    </Text>
    <StyledSummaryItemLabel fontSize={16} >
      {label}
    </StyledSummaryItemLabel>
  </Box>
)

SummaryItemBox.propTypes = {
  label: PropTypes.string,
  content: PropTypes.node
}

const CommonSummary = ({
  color,
  measurement_start_time,
  probe_asn,
  probe_cc,
  country
}) => {
  const intl = useIntl()
  const startTime = measurement_start_time
  const network = probe_asn
  const countryCode = probe_cc

  const countryBlock = <Flex flexWrap='wrap'>
    <Box mr={2} pb={1} width={1}>
      <Flag countryCode={countryCode} size={60} border />
    </Box>
    <Box>
      {country}
    </Box>
  </Flex>
 
  const formattedDate = new Intl.DateTimeFormat(intl.locale, { dateStyle: 'long', timeStyle: 'long', timeZone: 'UTC' }).format(new Date(startTime))
  
  return (
    <>
      <SummaryContainer py={4} color={color}>
        <Container>
          <Flex flexWrap='wrap' alignItems='flex-end' justifyContent='space-around'>
            {/*<SummaryItemBox
              label='Network Name'
              content='AT&T Lorem Ipsum Name A.T.T Internationale'
            />*/}
            <SummaryItemBox
              label={intl.formatMessage({ id: 'Measurement.CommonSummary.Label.Country' })}
              content={countryBlock}
            />
            <SummaryItemBox
              label={intl.formatMessage({ id: 'Measurement.CommonSummary.Label.ASN' })}
              content={network}
              link={`/network/${network}`}
            />
            <SummaryItemBox
              label={intl.formatMessage({ id: 'Measurement.CommonSummary.Label.DateTime' })}
              content={formattedDate}
            />
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
  country: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
}

export default CommonSummary
