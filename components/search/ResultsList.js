import Link from 'next/link'
import PropTypes from 'prop-types'
import { defineMessages, useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import url from 'url'

import Flag from '../Flag'
import {
  colorAnomaly,
  colorConfirmed,
  colorError,
  colorNormal,
} from '../colors'
import { testNames } from '/components/test-info'

const testsWithStates = [
  'web_connectivity',
  'telegram',
  'whatsapp',
  'facebook_messenger',
  'signal',
  'tor',
  'torsf',
  'psiphon',
  'http_header_field_manipulation',
  'http_invalid_request_line',
]

const imTests = ['telegram', 'whatsapp', 'facebook_messenger']

const messages = defineMessages({
  'Search.web_connectivity.Results.Reachable': {
    id: 'General.Accessible',
    defaultMessage: '',
  },
  'Search.web_connectivity.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: '',
  },
  'Search.web_connectivity.Results.Blocked': {
    id: 'Search.WebConnectivity.Results.Blocked',
    defaultMessage: '',
  },
  'Search.web_connectivity.Results.Error': {
    id: 'General.Error',
    defaultMessage: '',
  },
  'Search.whatsapp.Results.Reachable': {
    id: 'General.Accessible',
    defaultMessage: '',
  },
  'Search.whatsapp.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: '',
  },
  'Search.whatsapp.Results.Error': {
    id: 'General.Error',
    defaultMessage: '',
  },
  'Search.facebook_messenger.Results.Reachable': {
    id: 'General.Accessible',
    defaultMessage: '',
  },
  'Search.facebook_messenger.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: '',
  },
  'Search.facebook_messenger.Results.Error': {
    id: 'General.Error',
    defaultMessage: '',
  },
  'Search.telegram.Results.Reachable': {
    id: 'General.Accessible',
    defaultMessage: '',
  },
  'Search.telegram.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: '',
  },
  'Search.telegram.Results.Error': {
    id: 'General.Error',
    defaultMessage: '',
  },
  'Search.signal.Results.Reachable': {
    id: 'General.Accessible',
    defaultMessage: '',
  },
  'Search.signal.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: '',
  },
  'Search.signal.Results.Error': {
    id: 'General.Error',
    defaultMessage: '',
  },
  'Search.http_invalid_request_line.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: '',
  },
  'Search.http_invalid_request_line.Results.Reachable': {
    id: 'General.OK',
    defaultMessage: '',
  },
  'Search.http_invalid_request_line.Results.Error': {
    id: 'General.Error',
    defaultMessage: '',
  },
  'Search.http_header_field_manipulation.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: '',
  },
  'Search.http_header_field_manipulation.Results.Reachable': {
    id: 'General.OK',
    defaultMessage: '',
  },
  'Search.http_header_field_manipulation.Results.Error': {
    id: 'General.Error',
    defaultMessage: '',
  },
  'Search.http_requests.Results.Reachable': {
    id: 'Search.HTTPRequests.Results.Reachable',
    defaultMessage: '',
  },
  'Search.http_requests.Results.Error': {
    id: 'Search.HTTPRequests.Results.Error',
    defaultMessage: '',
  },
  'Search.http_requests.Results.Blocked': {
    id: 'Search.HTTPRequests.Results.Blocked',
    defaultMessage: '',
  },
  'Search.http_requests.Results.Anomaly': {
    id: 'Search.HTTPRequests.Results.Anomaly',
    defaultMessage: '',
  },
  'Search.tor.Results.Reachable': {
    id: 'General.OK',
    defaultMessage: '',
  },
  'Search.tor.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: '',
  },
  'Search.tor.Results.Error': {
    id: 'General.Error',
    defaultMessage: '',
  },
  'Search.torsf.Results.Reachable': {
    id: 'General.OK',
    defaultMessage: 'Reachable',
  },
  'Search.torsf.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: 'Anomaly',
  },
  'Search.torsf.Results.Error': {
    id: 'General.Error',
    defaultMessage: 'Anomaly',
  },
  'Search.psiphon.Results.Reachable': {
    id: 'General.OK',
    defaultMessage: '',
  },
  'Search.psiphon.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: '',
  },
  'Search.psiphon.Results.Error': {
    id: 'General.Error',
    defaultMessage: '',
  },
  'Search.riseupvpn.Results.Reachable': {
    id: 'General.Accessible',
    defaultMessage: '',
  },
  'Search.riseupvpn.Results.Anomaly': {
    id: 'General.Anomaly',
    defaultMessage: '',
  },
  'Search.riseupvpn.Results.Error': {
    id: 'General.Error',
    defaultMessage: '',
  },
})

const ASNBox = ({ asn }) => {
  const justNumber = asn.split('AS')[1]
  return <div className="text-gray-700">AS {justNumber}</div>
}

ASNBox.propTypes = {
  asn: PropTypes.string,
}

const tagClassNames = 'rounded-2xl py-1 px-2 text-xs'
const hollowTagClasNames = `${tagClassNames} bg-transparent border border-gray-700`

const getIndicators = ({
  test_name,
  scores = {},
  confirmed,
  anomaly,
  failure,
  intl,
}) => {
  let color = ''
  let tag = null
  if (testsWithStates.includes(test_name)) {
    if (imTests.includes(test_name) && Object.entries(scores).length === 0) {
      return [color, tag]
    }

    const computedMessageIdPrefix = `Search.${test_name}.Results`
    const blockingType = scores.analysis?.blocking_type

    if (failure === true) {
      color = colorError
      tag = (
        <div className={hollowTagClasNames}>
          {intl.formatMessage(messages[`${computedMessageIdPrefix}.Error`])}
        </div>
      )
    } else if (confirmed === true) {
      color = colorConfirmed
      tag = (
        <div className={`${tagClassNames} bg-gray-700 text-white`}>
          {intl.formatMessage(messages[`${computedMessageIdPrefix}.Blocked`])}
        </div>
      )
    } else if (blockingType !== undefined) {
      color = colorAnomaly
      tag = <div className={hollowTagClasNames}>{blockingType}</div>
    } else if (anomaly === true) {
      color = colorAnomaly
      tag = (
        <div className={hollowTagClasNames}>
          {intl.formatMessage(messages[`${computedMessageIdPrefix}.Anomaly`])}
        </div>
      )
    } else {
      color = colorNormal
      tag = (
        <div className={tagClassNames}>
          {intl.formatMessage(messages[`${computedMessageIdPrefix}.Reachable`])}
        </div>
      )
    }
  }
  return [color, tag]
}

const ResultItem = ({
  test_name,
  input,
  measurement_uid,
  probe_cc,
  probe_asn,
  measurement_start_time,
  scores,
  confirmed,
  anomaly,
  failure,
}) => {
  const intl = useIntl()
  const pathMaxLen = 10
  let inputLabel = input
  if (input) {
    const p = url.parse(input)

    if (p.protocol !== null) {
      // Truncate the path part of the URL to ${pathMaxLen}
      let path = p.path
      if (path && path.length > pathMaxLen) {
        path = `${path.substr(0, pathMaxLen)}…`
      }

      // Truncate the domain to ${domainMaxLen}
      const domainMaxLen = 25
      if (p.host && p.host.length > domainMaxLen) {
        p.host = `${p.host.substr(0, domainMaxLen)}…`
      }

      inputLabel = (
        <span>
          <span className="text-black">{`${p.protocol}//${p.host}`}</span>
          {path}
        </span>
      )
    } else {
      inputLabel = <span className="text-black">{p.path}</span>
    }
  }

  const [indicatorColor, tag] = getIndicators({
    test_name,
    scores,
    confirmed,
    anomaly,
    failure,
    intl,
  })
  const testName = testNames[test_name]?.name || test_name

  return (
    <Link href={`/m/${measurement_uid}`} prefetch={false}>
      <div className="flex flex-wrap items-stretch text-gray-700 bg-white hover:bg-gray-50 border-b border-gray-400">
        <div className="w-1 mr-4">
          <div
            className="w-[5px] h-full "
            style={{ backgroundColor: indicatorColor }}
          />
        </div>
        <div className=" flex-1 py-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className=" w-full md:w-3/5">
              <div className="flex items-center">
                <div className="w-1/12">
                  <div className="text-gray-800">{probe_cc}</div>
                </div>
                <div className="w-1/12">
                  <Flag countryCode={probe_cc} size={32} />
                </div>
                <div className="w-2/12">
                  <ASNBox asn={probe_asn} />
                </div>
                <div className="w-4/12">
                  {dayjs
                    .utc(measurement_start_time)
                    .format('YYYY-MM-DD HH:mm [UTC]')}
                </div>
                <div className="w-4/12 bbbbb">{testName}</div>
              </div>
            </div>

            <div className="md:w-2/5">
              <div className="flex justify-between items-center">
                {input && (
                  <div className="text-gray-500" title={input}>
                    {inputLabel}
                  </div>
                )}
                <div className="mr-4">{tag}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

ResultItem.propTypes = {
  test_name: PropTypes.string,
  input: PropTypes.string,
  measurement_uid: PropTypes.string,
  probe_cc: PropTypes.string,
  probe_asn: PropTypes.string,
  measurement_start_time: PropTypes.string,
  scores: PropTypes.object,
  confirmed: PropTypes.bool,
  anomaly: PropTypes.bool,
  failure: PropTypes.bool,
}

const ResultsList = ({ results }) => {
  return (
    <div className="flex">
      <div
        className="border overflow-hidden rounded w-full"
        data-test-id="results-list"
      >
        {results.map((msmt, idx) => {
          return <ResultItem key={idx} {...msmt} />
        })}
      </div>
    </div>
  )
}

ResultsList.propTypes = {
  results: PropTypes.array,
}

export default ResultsList
