import React from 'react'

import WebConnectivityDetails from './nettests/web_connectivity'
import TelegramDetails from './nettests/telegram'
import DefaultTestDetails from './nettests/default'

const mapTestDetails = {
  web_connectivity: WebConnectivityDetails,
  telegram: TelegramDetails
}

const renderDetails = (testName = 'other', testKeys) => {
  const TestDetails = mapTestDetails[testName] || DefaultTestDetails
  return <TestDetails testKeys={testKeys} />
}

export default renderDetails
