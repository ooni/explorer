import React from 'react'

import WebConnectivityDetails from './nettests/web_connectivity'
import TelegramDetails from './nettests/telegram'
import WhatsAppDetails from './nettests/whatsapp'
import DashDetails from './nettests/dash'
import DefaultTestDetails from './nettests/default'

const mapTestDetails = {
  web_connectivity: WebConnectivityDetails,
  whatsapp: WhatsAppDetails,
  dash: DashDetails,
  telegram: TelegramDetails
}

const renderDetails = (testName = 'other', testKeys) => {
  const TestDetails = mapTestDetails[testName] || DefaultTestDetails
  return <TestDetails testKeys={testKeys} />
}

export default renderDetails
