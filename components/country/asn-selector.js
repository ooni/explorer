import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'ooni-components'
import styled from 'styled-components'

const StyledSelect = styled(Select)`
  font-family: 'Fira Sans';
`

const ASNSelector = ({ networks, onNetworkChange }) => (
  <StyledSelect onChange={(e) => onNetworkChange(e.target.value)}>
    {
      networks.map((network, index) => (
        <option key={index} value={network.probe_asn}>
          {`AS${network.probe_asn} (${network.count} Tests)`}
        </option>
      ))
    }
  </StyledSelect>
)

ASNSelector.propTypes = {
  networks: PropTypes.arrayOf(PropTypes.shape({
    probe_asn: PropTypes.number,
    count: PropTypes.number
  })),
  onNetworkChange: PropTypes.func
}

export default ASNSelector
