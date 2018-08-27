import React from 'react'

import WebConnectivityDetails from './nettests/web_connectivity'
import DefaultTestDetails from './nettests/default'

const mapTestDetails = {
  web_connectivity: WebConnectivityDetails,
}

const renderDetails = (testName = 'other', testKeys) => {
  const TestDetails = mapTestDetails[testName] || DefaultTestDetails
  return <TestDetails testKeys={testKeys} />
}

export default renderDetails
