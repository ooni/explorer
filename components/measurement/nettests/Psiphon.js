import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Flex, Box } from 'ooni-components'

const PsiphonDetails = ({
  measurement,
  country,
  render
}) => {
  const {
    probe_asn,
    test_start_time,
    test_keys: {
      failure,
      bootstrap_time,
      max_runtime
    }
  } = measurement

  return (
    <React.Fragment>
      {render({
        status: 'status',
        statusInfo: 'statusInfo',
        summaryText: 'SummaryText',
        details: (
          <React.Fragment>
            <Flex>
              <Box>
                In a Flex &gt; Box
              </Box>
            </Flex>
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

PsiphonDetails.propTypes = {
  render: PropTypes.func,
  measurement: PropTypes.object.isRequired,
  country: PropTypes.string.isRequired
}

export default PsiphonDetails
