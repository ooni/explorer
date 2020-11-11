import React from 'react'

import WebConnectivityDetails from './nettests/WebConnectivity'
import TelegramDetails from './nettests/Telegram'
import WhatsAppDetails from './nettests/WhatsApp'
import DashDetails from './nettests/Dash'
import NdtDetails from './nettests/Ndt'

import FacebookMessengerDetails from './nettests/FacebookMessenger'
import HttpHeaderFieldManipulationDetails from './nettests/HTTPHeaderFieldManipulation'
import HttpInvalidRequestLine from './nettests/HTTPInvalidRequestLine'

import VanillaTorDetails from './nettests/VanillaTor'
import PsiphonDetails from './nettests/Psiphon'
import TorDetails from './nettests/Tor'
import RiseupVPNDetails from './nettests/RiseupVPN'

import DefaultTestDetails from './nettests/Default'

const mapTestDetails = {
  web_connectivity: WebConnectivityDetails,
  dash: DashDetails,
  ndt: NdtDetails,
  whatsapp: WhatsAppDetails,
  facebook_messenger: FacebookMessengerDetails,
  telegram: TelegramDetails,
  http_header_field_manipulation: HttpHeaderFieldManipulationDetails,
  http_invalid_request_line: HttpInvalidRequestLine,
  vanilla_tor: VanillaTorDetails,
  psiphon: PsiphonDetails,
  tor: TorDetails,
  riseupvpn: RiseupVPNDetails,
}


const MeasurementContainer = ({ testName, measurement, ...props }) => {
  const TestDetails = measurement ? mapTestDetails[testName] : DefaultTestDetails
  return (
    <React.Fragment>
      <TestDetails measurement={measurement} {...props} />
    </React.Fragment>
  )
}

export default MeasurementContainer
