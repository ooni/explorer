import Link from 'next/link'
import { useContext } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { hostnameFromUrl } from 'utils'

import { EmbeddedViewContext } from '../../pages/m/[measurement_uid]'
import ConditionalWrapper from '../ConditionalWrapper'

const messages = defineMessages({
  'blockingReason.http-diff': {
    id: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.HTTP-diff',
    defaultMessage: '',
  },
  'blockingReason.http-failure': {
    id: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.HTTP-failure',
    defaultMessage: '',
  },
  'blockingReason.dns': {
    id: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.DNS',
    defaultMessage: '',
  },
  'blockingReason.tcp_ip': {
    id: 'Measurement.SummaryText.Websites.Anomaly.BlockingReason.TCP',
    defaultMessage: '',
  },
  webConnectivityConfirmed: {
    id: 'Measurement.Metadata.WebConnectivity.ConfirmedBlocked',
    defaultMessage: '{hostname} was blocked in {country}',
  },
  webConnectivityAnomaly: {
    id: 'Measurement.Metadata.WebConnectivity.Anomaly',
    defaultMessage: '{hostname} showed signs of {reason} in {country}',
  },
  webConnectivityAccessible: {
    id: 'Measurement.Metadata.WebConnectivity.Accessible',
    defaultMessage: '{hostname} was accessible in {country}',
  },
  webConnectivityDown: {
    id: 'Measurement.Metadata.WebConnectivity.Down',
    defaultMessage: '{hostname} was down in {country}',
  },
  webConnectivityFailed: {
    id: 'Measurement.Metadata.WebConnectivity.Failed',
    defaultMessage: '{hostname} failed to be measured in {country}',
  },
  dash: {
    id: 'Measurement.Metadata.Dash',
    defaultMessage:
      '{videoQuality} quality video streaming at {speed} Mbit/s speed in {country}',
  },
  ndt: {
    id: 'Measurement.Metadata.Ndt',
    defaultMessage: 'Speed test result (NDT Test) in {country}',
  },
  httpHeaderManipulationMiddleboxes: {
    id: 'Measurement.Metadata.HTTPHeaderManipulation.MiddleboxesDetected',
    defaultMessage: 'HTTP header manipulation was detected in {country}',
  },
  httpHeaderManipulationNoMiddleboxes: {
    id: 'Measurement.Metadata.HTTPHeaderManipulation.NoMiddleboxesDetected',
    defaultMessage: 'HTTP header manipulation was not detected in {country}',
  },
  httpInvalidReqLineMiddleboxes: {
    id: 'Measurement.Metadata.HTTPInvalidReqLine.Middleboxes',
    defaultMessage: 'Network traffic manipulation was detected in {country}',
  },
  httpInvalidReqLineNoMiddleboxes: {
    id: 'Measurement.Metadata.HTTPInvalidReqLine.NoMiddleboxes',
    defaultMessage:
      'Network traffic manipulation was not detected in {country}',
  },
  vanillaTorReachable: {
    id: 'Measurement.Metadata.VanillaTor.Reachable',
    defaultMessage: 'Vanilla Tor was able to bootstrap in {country}',
  },
  vanillaTorUnReachable: {
    id: 'Measurement.Metadata.VanillaTor.UnReachable',
    defaultMessage: 'Vanilla Tor was NOT able to bootstrap in {country}',
  },
  whatsappReachable: {
    id: 'Measurement.Metadata.Whatsapp.Reachable',
    defaultMessage: 'WhatsApp was reachable in {country}',
  },
  whatsappUnReachable: {
    id: 'Measurement.Metadata.Whatsapp.UnReachable',
    defaultMessage: 'WhatsApp was likely blocked in {country}',
  },
  signalReachable: {
    id: 'Measurement.Metadata.Telegram.Reachable',
    defaultMessage: 'Signal was reachable in {country}',
  },
  signalBlocked: {
    id: 'Measurement.Metadata.Telegram.Blocked',
    defaultMessage: 'Signal was NOT reachable in {country}',
  },
  telegramReachable: {
    id: 'Measurement.Metadata.Telegram.Reachable',
    defaultMessage: 'Telegram was reachable in {country}',
  },
  telegramUnReachable: {
    id: 'Measurement.Metadata.Telegram.UnReachable',
    defaultMessage: 'Telegram was NOT reachable in {country}',
  },
  tor: {
    id: 'Measurement.Metadata.Tor',
    defaultMessage: 'Tor censorship test result in {country}',
  },
  psiphonReachable: {
    id: 'Measurement.Metadata.Psiphon.Reachable',
    defaultMessage: 'Psiphon was reachable in {country}',
  },
  psiphonUnReachable: {
    id: 'Measurement.Metadata.Psiphon.UnReachable',
    defaultMessage: 'Psiphon was NOT reachable in {country}',
  },
  facebookMessengerReachable: {
    id: 'Measurement.Metadata.FacebookMessenger.Reachable',
    defaultMessage: 'Facebook Messenger was reachable in {country}',
  },
  facebookMessengerNotReachable: {
    id: 'Measurement.Metadata.FacebookMessenger.NotReachable',
    defaultMessage: 'Facebook Messenger was NOT reachable in {country}',
  },
  torSnowflakeReachable: {
    id: 'Measurement.Metadata.TorSnowflake.Reachable',
    defaultMessage: '',
  },
  torSnowflakeUnReachable: {
    id: 'Measurement.Metadata.TorSnowflake.UnReachable',
    defaultMessage: '',
  },
  torSnowflakeError: {
    id: 'Measurement.Metadata.TorSnowflake.Error',
    defaultMessage: '',
  },
})

const unformatted = (message) => ({ message, formatted: false })

const getSearchHref = (input) =>
  `${process.env.NEXT_PUBLIC_EXPLORER_URL}/search?input=${input}`

const UrlWrapper = ({ href }) => {
  const isEmbeddedView = useContext(EmbeddedViewContext)

  return (
    <ConditionalWrapper
      condition={!isEmbeddedView}
      wrapper={(children) => (
        <Link
          href={getSearchHref(href)}
          className="inline"
          style={{ direction: 'ltr' }}
        >
          {children}
        </Link>
      )}
    >
      {href}
    </ConditionalWrapper>
  )
}

const getWebConnectivitySummary = ({
  measurement,
  scores,
  isConfirmed,
  isAnomaly,
  isFailure,
  input,
  country,
  date,
  probe_asn,
  intl,
  isEmbeddedView,
}) => {
  const { accessible, blocking } = measurement?.test_keys ?? {}
  const hostname = input ? hostnameFromUrl(input) : input
  const values = {
    date,
    WebsiteURL: <UrlWrapper href={input} />,
    network: probe_asn,
    country,
  }
  // The head metadata interpolates the hostname, which `HeadMetadata` does not
  // provide, so these messages are formatted here and passed as ready text
  const formatted = (message, extra) => ({
    message: intl.formatMessage(message, { date, hostname, country, ...extra }),
    formatted: true,
  })

  if (isFailure) {
    return {
      summaryText: (
        <FormattedMessage
          id="Measurement.SummaryText.Websites.Failed"
          values={values}
        />
      ),
      headMetadata: null,
    }
  }

  if (isConfirmed) {
    return {
      summaryText: (
        <FormattedMessage
          id="Measurement.SummaryText.Websites.ConfirmedBlocked"
          values={values}
        />
      ),
      headMetadata: formatted(messages.webConnectivityConfirmed),
    }
  }

  if (isAnomaly) {
    const blockingReason = blocking ?? scores?.analysis?.blocking_type ?? null
    const reasonMessage = messages[`blockingReason.${blockingReason}`]
    const reason = reasonMessage ? intl.formatMessage(reasonMessage) : null
    return {
      summaryText: (
        <FormattedMessage
          id="Measurement.SummaryText.Websites.Anomaly"
          values={{
            ...values,
            reason,
            'link-to-docs': (string) =>
              isEmbeddedView ? (
                string
              ) : (
                <a href="https://ooni.org/support/faq/#why-do-false-positives-occur">
                  {string}
                </a>
              ),
          }}
        />
      ),
      headMetadata: formatted(messages.webConnectivityAnomaly, { reason }),
    }
  }

  if (accessible) {
    return {
      summaryText: (
        <FormattedMessage
          id="Measurement.SummaryText.Websites.Accessible"
          values={values}
        />
      ),
      headMetadata: formatted(messages.webConnectivityAccessible),
    }
  }

  if (blocking === false) {
    // When not accessible, but also not blocking, it must be down
    return {
      summaryText: (
        <FormattedMessage
          id="Measurement.SummaryText.Websites.Down"
          values={values}
        />
      ),
      headMetadata: formatted(messages.webConnectivityDown),
    }
  }

  // Fallback condition to handle older measurements not present in fastpath
  // See: https://github.com/ooni/explorer/issues/426#issuecomment-612094244
  return {
    summaryText: (
      <FormattedMessage
        id="Measurement.SummaryText.Websites.Failed"
        values={values}
      />
    ),
    headMetadata: formatted(messages.webConnectivityFailed),
  }
}

/*
 * This table is derived from:
 * https://support.google.com/youtube/answer/1722171?hl=en-GB
 * Note: we use SFR rather than HFR because SFR is more common
 */
const minimumBitrateForVideo = [
  { sfr_min_bitrate: 600, type: '240p' },
  { sfr_min_bitrate: 1000, type: '360p' },
  { sfr_min_bitrate: 2500, type: '480p' },
  { sfr_min_bitrate: 5000, type: '720p (HD)' },
  { sfr_min_bitrate: 8000, type: '1080p (full HD)' },
  { sfr_min_bitrate: 16000, type: '1440p (2k)' },
  { sfr_min_bitrate: 35000, type: '2160p (4k)' },
]

const getOptimalQualityForBitrate = (medianBitrate) => {
  let optimalQuality = minimumBitrateForVideo[0]
  for (const rate of minimumBitrateForVideo) {
    if (medianBitrate >= rate.sfr_min_bitrate) {
      optimalQuality = rate
    }
  }
  return optimalQuality
}

const getDashSummary = ({ measurement, country, intl }) => {
  const testKeys = measurement?.test_keys ?? {}

  if (
    testKeys.failure === true ||
    typeof testKeys.simple === 'undefined' ||
    typeof testKeys.receiver_data === 'undefined'
  ) {
    return { summaryText: null, headMetadata: null }
  }

  return {
    summaryText: null,
    headMetadata: {
      message: intl.formatMessage(messages.dash, {
        videoQuality: getOptimalQualityForBitrate(
          testKeys.simple.median_bitrate,
        ).type,
        speed: (testKeys.simple.median_bitrate / 1000).toFixed(2),
        country,
      }),
      formatted: true,
    },
  }
}

const getWhatsAppSummary = ({ measurement, scores, isAnomaly }) => {
  const testKeys = measurement?.test_keys ?? {}
  let endpointsAccessible
  let webAccessible

  try {
    endpointsAccessible = scores.analysis.whatsapp_endpoints_accessible
    webAccessible = scores.analysis.whatsapp_web_accessible
  } catch {
    endpointsAccessible = testKeys.whatsapp_endpoints_status === 'ok'
    webAccessible = testKeys.whatsapp_web_status === 'ok'
  }

  let summaryText = 'Measurement.Details.SummaryText.WhatsApp.Reachable'

  if (isAnomaly) {
    if (!endpointsAccessible) {
      summaryText = 'Measurement.Details.SummaryText.WhatsApp.AppFailure'
    } else if (!webAccessible) {
      summaryText = 'Measurement.Details.SummaryText.WhatsApp.DesktopFailure'
    }
  }

  return {
    summaryText,
    headMetadata: unformatted(
      isAnomaly ? messages.whatsappUnReachable : messages.whatsappReachable,
    ),
  }
}

const getTelegramSummary = ({ measurement, isAnomaly }) => {
  const { telegram_web_status, telegram_tcp_blocking, telegram_http_blocking } =
    measurement?.test_keys ?? {}

  const webOK = telegram_web_status !== 'blocked'
  const desktopOK = !(
    telegram_tcp_blocking === true || telegram_http_blocking === true
  )

  let summaryText = 'Measurement.Details.SummaryText.Telegram.Reachable'

  if (!webOK) {
    summaryText = 'Measurement.Details.SummaryText.Telegram.AppFailure'
  }
  if (!desktopOK) {
    summaryText = 'Measurement.Details.SummaryText.Telegram.DesktopFailure'
  }
  if (isAnomaly || !webOK || !desktopOK) {
    summaryText =
      'Measurement.Details.SummaryText.Telegram.DesktopAndAppFailure'
  }

  const isReachable = webOK && desktopOK && !isAnomaly

  return {
    summaryText,
    headMetadata: unformatted(
      isReachable ? messages.telegramReachable : messages.telegramUnReachable,
    ),
  }
}

const getSignalSummary = ({ measurement }) => {
  const blocked = measurement?.test_keys?.signal_backend_status === 'blocked'

  return {
    summaryText: blocked
      ? 'Measurement.Details.SummaryText.Signal.Blocked'
      : 'Measurement.Details.SummaryText.Signal.Reachable',
    headMetadata: unformatted(
      blocked ? messages.signalBlocked : messages.signalReachable,
    ),
  }
}

const getFacebookMessengerSummary = ({ measurement, intl }) => {
  const testKeys = measurement?.test_keys ?? {}
  const isWorking =
    testKeys.facebook_dns_blocking === false &&
    testKeys.facebook_tcp_blocking === false

  if (isWorking) {
    return {
      summaryText:
        'Measurement.Details.SummaryText.FacebookMessenger.Reachable',
      headMetadata: unformatted(messages.facebookMessengerReachable),
    }
  }

  const text = [
    intl.formatMessage({
      id: testKeys.facebook_tcp_blocking
        ? 'Measurement.Details.SummaryText.FacebookMessenger.TCPFailure'
        : 'Measurement.Details.SummaryText.FacebookMessenger.TCPSuccess',
    }),
    intl.formatMessage({
      id: testKeys.facebook_dns_blocking
        ? 'Measurement.Details.SummaryText.FacebookMessenger.DNSFailure'
        : 'Measurement.Details.SummaryText.FacebookMessenger.DNSSuccess',
    }),
  ].join(' ')

  return {
    // SummaryText calls the function to get the already-formatted text
    summaryText: () => text,
    headMetadata: unformatted(messages.facebookMessengerNotReachable),
  }
}

const getHttpHeaderFieldManipulationSummary = ({ measurement }) => {
  const tampering = measurement?.test_keys?.tampering ?? {}
  const isAnomaly = Object.keys(tampering).some(
    (key) => tampering[key] === true,
  )

  return {
    summaryText: isAnomaly
      ? 'Measurement.HTTPHeaderManipulation.MiddleBoxesDetected.SummaryText'
      : 'Measurement.HTTPHeaderManipulation.NoMiddleBoxes.SummaryText',
    headMetadata: unformatted(
      isAnomaly
        ? messages.httpHeaderManipulationMiddleboxes
        : messages.httpHeaderManipulationNoMiddleboxes,
    ),
  }
}

const getHttpInvalidRequestLineSummary = ({ measurement }) => {
  const isAnomaly = measurement?.test_keys?.tampering === true

  return {
    summaryText: isAnomaly
      ? 'Measurement.HTTPInvalidReqLine.MiddleboxesDetected.SummaryText'
      : 'Measurement.HTTPInvalidReqLine.NoMiddleBoxes.SummaryText',
    headMetadata: unformatted(
      isAnomaly
        ? messages.httpInvalidReqLineMiddleboxes
        : messages.httpInvalidReqLineNoMiddleboxes,
    ),
  }
}

const getVanillaTorSummary = ({ isAnomaly }) => ({
  summaryText: isAnomaly
    ? 'Measurement.Details.SummaryText.TorVanilla.Blocked'
    : 'Measurement.Details.SummaryText.TorVanilla.Reachable',
  headMetadata: unformatted(
    isAnomaly ? messages.vanillaTorUnReachable : messages.vanillaTorReachable,
  ),
})

const getTorSummary = ({ isAnomaly, isFailure }) => {
  // https://github.com/ooni/spec/blob/master/nettests/ts-023-tor.md#possible-conclusions
  let summaryText = 'Measurement.Details.SummaryText.Tor.OK'
  if (isFailure) {
    summaryText = 'Measurement.Details.SummaryText.Tor.Error'
  } else if (isAnomaly) {
    summaryText = 'Measurement.Details.SummaryText.Tor.Blocked'
  }

  return { summaryText, headMetadata: unformatted(messages.tor) }
}

const getPsiphonSummary = ({ measurement }) => {
  const { failure, bootstrap_time } = measurement?.test_keys ?? {}

  if (failure) {
    return {
      summaryText:
        bootstrap_time === 0
          ? 'Measurement.Details.SummaryText.Psiphon.BootstrappingError'
          : 'Measurement.Details.SummaryText.Psiphon.Blocked',
      headMetadata: unformatted(messages.psiphonUnReachable),
    }
  }

  return {
    summaryText: 'Measurement.Details.SummaryText.Psiphon.OK',
    headMetadata: unformatted(messages.psiphonReachable),
  }
}

const getTorSnowflakeSummary = ({ isAnomaly, isFailure }) => {
  if (isFailure) {
    return {
      summaryText: 'Measurement.Details.SummaryText.TorSnowflake.Error',
      headMetadata: unformatted(messages.torSnowflakeError),
    }
  }
  if (isAnomaly) {
    return {
      summaryText: 'Measurement.Details.SummaryText.TorSnowflake.Blocked',
      headMetadata: unformatted(messages.torSnowflakeUnReachable),
    }
  }
  return {
    summaryText: 'Measurement.Details.SummaryText.TorSnowflake.OK',
    headMetadata: unformatted(messages.torSnowflakeReachable),
  }
}

const getNdtSummary = () => ({
  summaryText: null,
  headMetadata: unformatted(messages.ndt),
})

/**
 * Builds the localised summary paragraph and the social/head metadata for a
 * measurement. Returns `summaryText` as either a message id (formatted by
 * `SummaryText` with the common values), a function returning ready text, a
 * React element, or null when the test has nothing to say.
 */
export const getMeasurementSummary = ({
  testName,
  measurement,
  scores,
  isConfirmed,
  isAnomaly,
  isFailure,
  input,
  country,
  date,
  probe_asn,
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
    country,
    date,
    probe_asn,
    intl,
    isEmbeddedView,
  }

  switch (testName) {
    case 'web_connectivity':
      return getWebConnectivitySummary(common)
    case 'dash':
      return getDashSummary(common)
    case 'ndt':
      return getNdtSummary(common)
    case 'whatsapp':
      return getWhatsAppSummary(common)
    case 'facebook_messenger':
      return getFacebookMessengerSummary(common)
    case 'telegram':
      return getTelegramSummary(common)
    case 'signal':
      return getSignalSummary(common)
    case 'http_header_field_manipulation':
      return getHttpHeaderFieldManipulationSummary(common)
    case 'http_invalid_request_line':
      return getHttpInvalidRequestLineSummary(common)
    case 'vanilla_tor':
      return getVanillaTorSummary(common)
    case 'psiphon':
      return getPsiphonSummary(common)
    case 'tor':
      return getTorSummary(common)
    case 'torsf':
      return getTorSnowflakeSummary(common)
    default:
      return { summaryText: null, headMetadata: null }
  }
}
