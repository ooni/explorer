import React from 'react'

import WebConnectivityDetails from './nettests/web_connectivity'
import TelegramDetails from './nettests/telegram'
import WhatsAppDetails from './nettests/whatsapp'
import DashDetails from './nettests/dash'
import NdtDetails from './nettests/ndt'

import FacebookMessengerDetails from './nettests/facebook_messenger'
import HttpHeaderFieldManipulationDetails from './nettests/http_header_field_manipulation'
import HttpInvalidRequestLine from './nettests/http_invalid_request_line'

import VanillaTorDetails from './nettests/vanilla_tor'

import DefaultTestDetails from './nettests/default'

const mapTestDetails = {
  web_connectivity: WebConnectivityDetails,
  dash: DashDetails,
  ndt: NdtDetails,
  whatsapp: WhatsAppDetails,
  facebook_messenger: FacebookMessengerDetails,
  telegram: TelegramDetails,
  http_header_field_manipulation: HttpHeaderFieldManipulationDetails,
  http_invalid_request_line: HttpInvalidRequestLine,
  vanilla_tor: VanillaTorDetails
}

// FIXME to have header and stuff
const MeasurementNotFound = () => <h4>Measurement not Found</h4>

const MeasurementContainer = ({ measurement, render }) => {
  if (measurement === undefined) {
    return <MeasurementNotFound />
  }

  const TestDetails = mapTestDetails[measurement.test_name] || DefaultTestDetails
  return <TestDetails measurement={measurement} render={render} />
}

export default MeasurementContainer
