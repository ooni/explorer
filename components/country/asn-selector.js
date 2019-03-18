import React from 'react'
import { Select } from 'ooni-components'

const ASNSelector = ({ networks, onNetworkChange }) => (
  <Select onChange={(e) => onNetworkChange(e.target.value)}>
    {
      networks.map((network, index) => (
        <option key={index} value={network.probe_asn}>
          {`ASN${network.probe_asn} (${network.count} Tests)`}
        </option>
      ))
    }
  </Select>
)

ASNSelector.defaultProps = {
  networks: [
    {
      probe_asn: 'ASN0',
      count: 0
    },
    {
      probe_asn: 'ASN1',
      count: 1
    }

  ]
}

export default ASNSelector
