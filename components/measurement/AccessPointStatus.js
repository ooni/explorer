import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'ooni-components'
import { Text } from 'rebass'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

const StatusText = styled(Text)`
  color: ${props => props.ok && props.theme.colors.yellow9}
`

const AccessPointStatus = ({ icon, label, ok , content, color, ...props}) => {
  if (content === undefined) {
    if (ok) {
      content = <FormattedMessage id='Measurement.Details.Endpoint.Status.Okay' />
    } else {
      content = <FormattedMessage id='Measurement.Details.Endpoint.Status.Failed' />
    }
  }

  return (
    <Box {...props}>
      {icon}
      <Text fontWeight='bold' fontSize={0}>{label}</Text>
      <StatusText
        ok={!ok}
        fontSize={3}
        fontWeight={200}
        color={color}
      >
        {content}
      </StatusText>
    </Box>
  )
}

AccessPointStatus.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  ok: PropTypes.bool.isRequired,
  content: PropTypes.element
}

export default AccessPointStatus
