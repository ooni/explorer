import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

const StatusText = styled(Text)`
  color: ${props => props.$ok === false ? props.theme.colors.yellow9 : 'unset'}
`

const AccessPointStatus = ({ icon, label, ok, content, color, ...props}) => {
  if (content === undefined) {
    if (ok === true) {
      content = <FormattedMessage id='General.OK' />
    } else if (ok === false){
      content = <FormattedMessage id='General.Failed' />
    } else {
      content = <FormattedMessage id='Measurement.Details.Endpoint.Status.Unknown' />
    }
  }

  return (
    <Box {...props}>
      {icon}
      <Text fontWeight='bold' fontSize={0}>{label}</Text>
      <StatusText
        $ok={ok}
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
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  ok: PropTypes.oneOf([true, false, undefined]),
  content: PropTypes.any
}

export default AccessPointStatus
