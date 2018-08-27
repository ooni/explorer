import React from 'react'

import WebConnectivityDetails from './nettests/web_connectivity'

const mapTestDetails = {
  web_connectivity: WebConnectivityDetails,
}

const renderDetails = (testName = 'other', testKeys) => {
  const TestDetails = mapTestDetails[testName]
  return <TestDetails testKeys={testKeys} />
}

export default renderDetails
