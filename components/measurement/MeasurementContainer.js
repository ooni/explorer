import PropTypes from 'prop-types'
import DashDetails from './nettests/Dash'
import FacebookMessengerDetails from './nettests/FacebookMessenger'
import HttpHeaderFieldManipulationDetails from './nettests/HTTPHeaderFieldManipulation'
import HttpInvalidRequestLine from './nettests/HTTPInvalidRequestLine'
import NdtDetails from './nettests/Ndt'
import SignalDetails from './nettests/Signal'
import TelegramDetails from './nettests/Telegram'
import WebConnectivityDetails from './nettests/WebConnectivity'
import WhatsAppDetails from './nettests/WhatsApp'

import PsiphonDetails from './nettests/Psiphon'
import TorDetails from './nettests/Tor'
import VanillaTorDetails from './nettests/VanillaTor'

import DefaultTestDetails from './nettests/Default'
import TorSnowflakeDetails from './nettests/TorSnowflake'

const mapTestDetails = {
  web_connectivity: WebConnectivityDetails,
  dash: DashDetails,
  ndt: NdtDetails,
  whatsapp: WhatsAppDetails,
  facebook_messenger: FacebookMessengerDetails,
  telegram: TelegramDetails,
  signal: SignalDetails,
  http_header_field_manipulation: HttpHeaderFieldManipulationDetails,
  http_invalid_request_line: HttpInvalidRequestLine,
  vanilla_tor: VanillaTorDetails,
  psiphon: PsiphonDetails,
  tor: TorDetails,
  torsf: TorSnowflakeDetails,
}

const MeasurementContainer = ({ testName, measurement, ...props }) => {
  const TestDetails =
    testName in mapTestDetails ? mapTestDetails[testName] : DefaultTestDetails
  return (
    <>
      <TestDetails measurement={measurement} {...props} />
    </>
  )
}

MeasurementContainer.propTypes = {
  measurement: PropTypes.any,
  testName: PropTypes.any,
}

export default MeasurementContainer
