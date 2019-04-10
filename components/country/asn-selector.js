import React from 'react'
import { Select } from 'ooni-components'

const ASNSelector = ({ networks, onNetworkChange }) => (
  <Select onChange={(e) => onNetworkChange(e.target.value)}>
    {
      networks.map((network, index) => (
        <option key={index} value={network.probe_asn}>
          {`AS${network.probe_asn} (${network.count} Tests)`}
        </option>
      ))
    }
  </Select>
)

export default ASNSelector
