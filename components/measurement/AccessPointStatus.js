import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'ooni-components'
import { Text } from 'rebass'
import { FormattedMessage } from 'react-intl'

const AccessPointStatus = ({ icon, label, ok }) => (
  <Box>
    {icon}
    <Text fontWeight='bold' fontSize={0}>{label}</Text>
    <Text
      fontSize={3}
      fontWeight={200}
    >
      {ok
        ? <FormattedMessage id='Measurement.Details.Endpoint.Status.Okay' />
        : <FormattedMessage id='Measurement.Details.Endpoint.Status.Failed' />
      }
    </Text>
  </Box>
)

AccessPointStatus.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  ok: PropTypes.bool.isRequired
}

export default AccessPointStatus
