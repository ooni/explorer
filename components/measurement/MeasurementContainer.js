import React from 'react'
import PropTypes from 'prop-types'
import WebConnectivityDetails from './nettests/WebConnectivity'
import TelegramDetails from './nettests/Telegram'
import WhatsAppDetails from './nettests/WhatsApp'
import DashDetails from './nettests/Dash'
import NdtDetails from './nettests/Ndt'
import SignalDetails from './nettests/Signal'
import FacebookMessengerDetails from './nettests/FacebookMessenger'
import HttpHeaderFieldManipulationDetails from './nettests/HTTPHeaderFieldManipulation'
import HttpInvalidRequestLine from './nettests/HTTPInvalidRequestLine'

import VanillaTorDetails from './nettests/VanillaTor'
import PsiphonDetails from './nettests/Psiphon'
import TorDetails from './nettests/Tor'
import RiseupVPNDetails from './nettests/RiseupVPN'

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
  riseupvpn: RiseupVPNDetails,
  torsf: TorSnowflakeDetails
}


const MeasurementContainer = ({ testName, measurement, ...props }) => {
  const TestDetails = testName in mapTestDetails ? mapTestDetails[testName] : DefaultTestDetails
  return (
    <React.Fragment>
      <TestDetails measurement={measurement} {...props} />
    </React.Fragment>
  )
}

MeasurementContainer.propTypes = {
  measurement: PropTypes.any,
  testName: PropTypes.any
}

export const useMeasurement = (props) => {

  const {
    testName,
    confirmed,
    anomaly,
    failure,
    country,
    measurement,
    scores,
    measurement_start_time,
    probe_asn,
    input
  } = props

  const getTestDetails = testName in mapTestDetails ? mapTestDetails[testName] : DefaultTestDetails

  /**
   * 
   */
  const {
    status,
    statusIcon = undefined,
    statusLabel = undefined,
    statusInfo = undefined,
    legacy = false,
    summaryText,
    headMetadata,
    details
  } = getTestDetails({...props})

  const where = typeof window === 'undefined' ? 'server' : 'client'

  console.log(where, status)

  return {
    status,
    statusIcon,
    statusLabel,
    statusInfo,
    legacy,
    summaryText,
    headMetadata,
    details
  }
}

export default MeasurementContainer
