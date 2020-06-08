import React from 'react'
import Head from 'next/head'
import { useIntl } from 'react-intl'

const MesHead = ({
  testName,
  testDateTime,
  country
}) => {
  const intl = useIntl()
  const testNames = {
    /* Websites */
    'web_connectivity': {
      name: intl.formatMessage({id:'Tests.WebConnectivity.Name'})
    },

    /* Middlebox tests */
    'http_invalid_request_line': {
      name: intl.formatMessage({id:'Tests.HTTPInvalidReqLine.Name'})
    },
    'http_header_field_manipulation': {
      name: intl.formatMessage({id:'Tests.HTTPHeaderManipulation.Name'})
    },

    /* IM Tests */
    'facebook_messenger': {
      name: intl.formatMessage({id:'Tests.Facebook.Name'})
    },
    'telegram': {
      name: intl.formatMessage({id:'Tests.Telegram.Name'})
    },
    'whatsapp': {
      name: intl.formatMessage({id:'Tests.WhatsApp.Name'})
    },

    /* Performance */
    'ndt': {
      name: intl.formatMessage({id:'Tests.NDT.Name'})
    },
    'dash': {
      name: intl.formatMessage({id:'Tests.Dash.Name'})
    },

    /* Censorship circumvention */
    'vanilla_tor': {
      name: intl.formatMessage({id:'Tests.TorVanilla.Name'})
    },
    'bridge_reachability': {
      name: intl.formatMessage({id:'Tests.BridgeReachability.Name'})
    },
    'psiphon': {
      name: intl.formatMessage({id:'Tests.Psiphon.Name'})
    },
    'tor': {
      name: intl.formatMessage({id:'Tests.Tor.Name'})
    },

    /* Legacy tests */
    'tcp_connect': {
      name: intl.formatMessage({id:'Tests.TCPConnect.Name'})
    },
    'dns_consistency': {
      name: intl.formatMessage({id:'Tests.DNSConsistency.Name'})
    },
    'http_requests': {
      name: intl.formatMessage({id:'Tests.HTTPRequests.Name'})
    }
  }
  const formattedTestName = testNames[testName].name

  return (
    <Head>
      <title>{`OONI ${formattedTestName} Results`}</title>
      <meta
        key="og:title"
        property="og:title"
        content={`OONI ${formattedTestName} Results`}
      />
      <meta
        key="og:description"
        property="og:description"
        content={intl.formatMessage(
          {
            id: 'Measurement.Metadata.Description',
            defaultMessage:
            'View results of {testName} Test in {countryName} on {date}'
          },
          {
            testName: formattedTestName,
            countryName: country,
            date: intl.formatDate(testDateTime)
          }
        )}
      />
    </Head>
  )
}

export default MesHead
