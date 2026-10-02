import Link from 'next/link'
import { MdFlashOn } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import { hostnameFromUrl } from 'utils'

import ConditionalWrapper from '../ConditionalWrapper'
import { InfoBoxItem } from './InfoBoxItem'
import { mlabServerDetails } from './mlab_utils'
import StatusInfo from './StatusInfo'

const minimumBitrateForVideo = [
  { sfr_min_bitrate: 600, type: '240p' },
  { sfr_min_bitrate: 1000, type: '360p' },
  { sfr_min_bitrate: 2500, type: '480p' },
  { sfr_min_bitrate: 5000, type: '720p (HD)' },
  { sfr_min_bitrate: 8000, type: '1080p (full HD)' },
  { sfr_min_bitrate: 16000, type: '1440p (2k)' },
  { sfr_min_bitrate: 35000, type: '2160p (4k)' },
]

const getOptimalQualityForBitrate = (testKeys) => {
  let optimalQuality = minimumBitrateForVideo[0]
  for (const rate of minimumBitrateForVideo) {
    if (testKeys.simple.median_bitrate >= rate.sfr_min_bitrate) {
      optimalQuality = rate
    }
  }
  return optimalQuality
}

const webConnectivityBlockingReasonIds = {
  'http-diff':
    'Measurement.SummaryText.Websites.Anomaly.BlockingReason.HTTP-diff',
  'http-failure':
    'Measurement.SummaryText.Websites.Anomaly.BlockingReason.HTTP-failure',
  dns: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.DNS',
  tcp_ip: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.TCP',
}

const getWebConnectivityHero = ({
  measurement,
  scores,
  isConfirmed,
  isAnomaly,
  isFailure,
  input,
  intl,
  isEmbeddedView,
}) => {
  const testKeys = measurement?.test_keys ?? {}
  const { accessible, blocking } = testKeys
  const hostname = input ? hostnameFromUrl(input) : input

  let status = 'default'
  let reason = null

  if (isFailure) {
    status = 'error'
  } else if (isConfirmed) {
    status = 'confirmed'
  } else if (isAnomaly) {
    status = 'anomaly'
    const blockingReason = blocking ?? scores?.analysis?.blocking_type ?? null
    const reasonId = webConnectivityBlockingReasonIds[blockingReason]
    if (reasonId) {
      reason = intl.formatMessage({ id: reasonId, defaultMessage: '' })
    }
  } else if (accessible) {
    status = 'reachable'
  } else if (blocking === false) {
    status = 'down'
  } else {
    status = 'error'
  }

  return {
    status,
    info: (
      <StatusInfo
        title={
          <ConditionalWrapper
            condition={!isEmbeddedView}
            wrapper={(children) => (
              <Link
                className="text-white underline hover:text-white"
                href={`/domain/${hostname}`}
              >
                {children}
              </Link>
            )}
          >
            {input}
          </ConditionalWrapper>
        }
        message={reason}
      />
    ),
  }
}

const getDashHero = ({ measurement, intl }) => {
  const testKeys = measurement?.test_keys ?? {}
  const failure = testKeys.failure

  if (
    failure === true ||
    typeof testKeys.simple === 'undefined' ||
    typeof testKeys.receiver_data === 'undefined'
  ) {
    return { status: 'error' }
  }

  const optimalVideoRate = getOptimalQualityForBitrate(testKeys).type
  const medianBitrateInMbits = (testKeys.simple.median_bitrate / 1000).toFixed(
    2,
  )
  const playoutDelay = testKeys.simple.min_playout_delay.toFixed(2)

  return {
    status: 'default',
    statusIcon: <MdFlashOn />,
    statusLabel: intl.formatMessage({
      id: 'Measurement.Hero.Status.Dash.Title',
    }),
    info: (
      <div className="w-full">
        <div className="flex justify-around">
          <InfoBoxItem
            label={intl.formatMessage({
              id: 'Measurement.Status.Info.Label.VideoQuality',
            })}
            content={optimalVideoRate}
          />
          <InfoBoxItem
            label={intl.formatMessage({
              id: 'Measurement.Status.Info.Label.Bitrate',
            })}
            content={medianBitrateInMbits}
            unit="Mbit/s"
          />
          <InfoBoxItem
            label={intl.formatMessage({
              id: 'Measurement.Status.Info.Label.Delay',
            })}
            content={playoutDelay}
            unit="s"
          />
        </div>
      </div>
    ),
  }
}

const getNdtHero = ({ measurement, intl }) => {
  const testKeys = measurement?.test_keys ?? {}
  const isFailed = testKeys.failure !== null
  const isNdt7 = testKeys.protocol === 7
  const simple = (isNdt7 ? testKeys.summary : testKeys.simple) || {}
  const downloadMbit = simple.download && (simple.download / 1000).toFixed(2)
  const uploadMbit = simple.upload && (simple.upload / 1000).toFixed(2)
  const ping = simple.ping?.toFixed(1)
  const serverAddress = isNdt7
    ? testKeys.server?.hostname
    : testKeys.server_address
  const server = serverAddress
    ? mlabServerDetails(serverAddress, isNdt7)
    : 'bebbe'
  const serverLocation = server
    ? `${server.city}, ${server.countryName}`
    : 'N/A'

  return {
    status: 'default',
    statusIcon: <MdFlashOn />,
    statusLabel: intl.formatMessage({
      id: 'Measurement.Hero.Status.NDT.Title',
    }),
    info: (
      <div className="w-full">
        {isFailed ? (
          <div className="flex justify-around">
            <h4>Failed Test</h4>
          </div>
        ) : (
          <div className="flex justify-around">
            <InfoBoxItem
              label={intl.formatMessage({
                id: 'Measurement.Status.Info.Label.Download',
              })}
              content={downloadMbit}
              unit="Mbps"
            />
            <InfoBoxItem
              label={intl.formatMessage({
                id: 'Measurement.Status.Info.Label.Upload',
              })}
              content={uploadMbit}
              unit="Mbps"
            />
            <InfoBoxItem
              label={intl.formatMessage({
                id: 'Measurement.Status.Info.Label.Ping',
              })}
              content={ping}
              unit="ms"
            />
            <InfoBoxItem
              label={intl.formatMessage({
                id: 'Measurement.Status.Info.Label.Server',
              })}
              content={serverLocation}
            />
          </div>
        )}
      </div>
    ),
  }
}

const getHttpHeaderFieldManipulationHero = ({ measurement, intl }) => {
  const tampering = measurement?.test_keys?.tampering || {}
  let isAnomaly = false
  for (const key of Object.keys(tampering)) {
    if (tampering[key] === true) {
      isAnomaly = true
    }
  }

  return {
    status: isAnomaly ? 'anomaly' : 'reachable',
    statusLabel: isAnomaly
      ? intl.formatMessage({
          id: 'Measurement.Hero.Status.HTTPHeaderManipulation.MiddleboxesDetected',
        })
      : intl.formatMessage({
          id: 'Measurement.Hero.Status.HTTPHeaderManipulation.NoMiddleBoxes',
        }),
  }
}

const getHttpInvalidRequestLineHero = ({ measurement }) => {
  const isAnomaly = measurement?.test_keys?.tampering === true

  return {
    status: isAnomaly ? 'anomaly' : 'reachable',
    statusLabel: isAnomaly ? (
      <FormattedMessage id="Measurement.Hero.Status.HTTPInvalidReqLine.MiddleboxesDetected" />
    ) : (
      <FormattedMessage id="Measurement.Hero.Status.HTTPInvalidReqLine.NoMiddleBoxes" />
    ),
  }
}

const getVanillaTorHero = ({ isAnomaly }) => ({
  status: isAnomaly ? 'anomaly' : 'reachable',
  statusLabel: isAnomaly ? (
    <FormattedMessage id="Measurement.Hero.Status.TorVanilla.Blocked" />
  ) : (
    <FormattedMessage id="Measurement.Hero.Status.TorVanilla.Reachable" />
  ),
})

const getWhatsAppHero = ({ isAnomaly }) => ({
  status: isAnomaly ? 'anomaly' : 'reachable',
  info: isAnomaly ? (
    <FormattedMessage id="Measurement.Status.Hint.WhatsApp.Blocked" />
  ) : (
    <FormattedMessage id="Measurement.Details.Hint.WhatsApp.Reachable" />
  ),
})

const getSignalHero = ({ measurement, intl }) => {
  const anomaly = measurement?.test_keys?.signal_backend_status === 'blocked'

  return {
    status: anomaly ? 'anomaly' : 'reachable',
    info: anomaly
      ? intl.formatMessage({ id: 'Measurement.Status.Hint.Signal.Blocked' })
      : intl.formatMessage({ id: 'Measurement.Status.Hint.Signal.Reachable' }),
  }
}

const getTelegramHero = ({ isAnomaly }) => ({
  status: isAnomaly ? 'anomaly' : 'reachable',
  info: isAnomaly ? (
    <FormattedMessage id="Measurement.Status.Hint.Telegram.Blocked" />
  ) : (
    <FormattedMessage id="Measurement.Status.Hint.Telegram.Reachable" />
  ),
})

const getTorHero = ({ isAnomaly, isFailure }) => {
  if (isFailure) {
    return {
      status: 'error',
      info: <FormattedMessage id="Measurement.Status.Hint.Tor.Error" />,
    }
  }
  if (isAnomaly) {
    return {
      status: 'anomaly',
      info: <FormattedMessage id="Measurement.Status.Hint.Tor.Blocked" />,
    }
  }
  return {
    status: 'reachable',
    info: <FormattedMessage id="Measurement.Status.Hint.Tor.Reachable" />,
  }
}

const getPsiphonHero = ({ measurement }) => {
  const { failure, bootstrap_time } = measurement?.test_keys ?? {}

  if (failure) {
    return {
      status: 'anomaly',
      info:
        bootstrap_time === 0 ? (
          <FormattedMessage id="Measurement.Status.Hint.Psiphon.BootstrappingError" />
        ) : (
          <FormattedMessage id="Measurement.Status.Hint.Psiphon.Blocked" />
        ),
    }
  }

  return {
    status: 'reachable',
    info: <FormattedMessage id="Measurement.Status.Hint.Psiphon.Reachable" />,
  }
}

const getFacebookMessengerHero = ({ measurement, intl }) => {
  const testKeys = measurement?.test_keys ?? {}
  const isWorking =
    testKeys.facebook_dns_blocking === false &&
    testKeys.facebook_tcp_blocking === false
  const dnsBlocking = testKeys.facebook_dns_blocking === true
  const tcpBlocking = testKeys.facebook_tcp_blocking === true
  const statusMessages = []

  if (!isWorking) {
    if (tcpBlocking) {
      statusMessages.push(
        intl.formatMessage({
          id: 'Measurement.Details.FacebookMessenger.TCPFailed',
        }),
      )
    }
    if (dnsBlocking) {
      statusMessages.push(
        intl.formatMessage({
          id: 'Measurement.Details.FacebookMessenger.DNSFailed',
        }),
      )
    }
  }

  const statusTitle = isWorking
    ? intl.formatMessage({
        id: 'Measurement.Status.Hint.FacebookMessenger.Reachable',
      })
    : intl.formatMessage({
        id: 'Measurement.Status.Hint.FacebookMessenger.Blocked',
      })

  return {
    status: isWorking ? 'reachable' : 'anomaly',
    info: (
      <StatusInfo title={statusTitle} message={statusMessages.join('\n')} />
    ),
  }
}

const getTorSnowflakeHero = ({ isAnomaly, isFailure }) => {
  if (isFailure) {
    return {
      status: 'error',
      info: (
        <FormattedMessage id="Measurement.Status.Hint.TorSnowflake.Error" />
      ),
    }
  }
  if (isAnomaly) {
    return {
      status: 'anomaly',
      info: (
        <FormattedMessage id="Measurement.Status.Hint.TorSnowflake.Blocked" />
      ),
    }
  }
  return {
    status: 'reachable',
    info: (
      <FormattedMessage id="Measurement.Status.Hint.TorSnowflake.Reachable" />
    ),
  }
}

const getDefaultHero = ({ isConfirmed, isAnomaly, isFailure }) => {
  if (isFailure) return { status: 'error' }
  if (isConfirmed) return { status: 'confirmed' }
  if (isAnomaly) return { status: 'anomaly' }
  return { status: 'default' }
}

export const getMeasurementHeroProps = ({
  testName,
  measurement,
  scores,
  isConfirmed,
  isAnomaly,
  isFailure,
  input,
  intl,
  isEmbeddedView,
}) => {
  const common = {
    testName,
    measurement,
    scores,
    isConfirmed,
    isAnomaly,
    isFailure,
    input,
    intl,
    isEmbeddedView,
  }

  let hero
  switch (testName) {
    case 'web_connectivity':
      hero = getWebConnectivityHero(common)
      break
    case 'dash':
      hero = getDashHero(common)
      break
    case 'ndt':
      hero = getNdtHero(common)
      break
    case 'http_header_field_manipulation':
      hero = getHttpHeaderFieldManipulationHero(common)
      break
    case 'http_invalid_request_line':
      hero = getHttpInvalidRequestLineHero(common)
      break
    case 'vanilla_tor':
      hero = getVanillaTorHero(common)
      break
    case 'whatsapp':
      hero = getWhatsAppHero(common)
      break
    case 'signal':
      hero = getSignalHero(common)
      break
    case 'telegram':
      hero = getTelegramHero(common)
      break
    case 'tor':
      hero = getTorHero(common)
      break
    case 'psiphon':
      hero = getPsiphonHero(common)
      break
    case 'facebook_messenger':
      hero = getFacebookMessengerHero(common)
      break
    case 'torsf':
      hero = getTorSnowflakeHero(common)
      break
    default:
      hero = getDefaultHero(common)
  }

  const info = scores?.msg ?? hero.info ?? null

  return {
    status: hero.status,
    statusIcon: hero.statusIcon ?? null,
    statusLabel: hero.statusLabel ?? null,
    info,
  }
}
