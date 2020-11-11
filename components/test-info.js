import React from 'react'

import {
  theme
} from 'ooni-components'

import FaBeer from 'react-icons/lib/fa/beer'
import {
  NettestGroupWebsites,
  NettestGroupInstantMessaging,
  NettestGroupMiddleBoxes,
  NettestGroupPerformance,
  NettestGroupCircumvention
} from 'ooni-components/dist/icons'
import { FormattedMessage } from 'react-intl'


export const testGroups = {
  'websites': {
    'color': theme.colors.indigo5,
    'name': <FormattedMessage id='Tests.Groups.Webistes.Name' />,
    'icon': <NettestGroupWebsites />
  },
  'im': {
    'color': theme.colors.cyan6,
    'name': <FormattedMessage id='Tests.Groups.Instant Messagging.Name' />,
    'icon': <NettestGroupInstantMessaging />
  },
  'middlebox': {
    'color': theme.colors.violet8,
    'name': <FormattedMessage id='Tests.Groups.Middlebox.Name' />,
    'icon': <NettestGroupMiddleBoxes />
  },
  'performance': {
    'color': theme.colors.fuchsia6,
    'name': <FormattedMessage id='Tests.Groups.Performance.Name' />,
    'icon': <NettestGroupPerformance />
  },
  'circumvention': {
    'color': theme.colors.pink6,
    'name': <FormattedMessage id='Tests.Groups.Circumvention.Name' />,
    'icon': <NettestGroupCircumvention />
  },
  'legacy': {
    'color': theme.colors.gray5,
    'name': <FormattedMessage id='Tests.Groups.Legacy.Name' />,
    'icon': <FaBeer />
  },
  'default': {
    'color': theme.colors.gray5,
    'name': null,
    'icon': <FaBeer />
  },
}

export const testNames = {
  /* Websites */
  'web_connectivity': {
    group: 'websites',
    name: <FormattedMessage id='Tests.WebConnectivity.Name' />,
    info: 'https://ooni.org/nettest/web-connectivity/'
  },

  /* Middlebox tests */
  'http_invalid_request_line': {
    group: 'middlebox',
    name: <FormattedMessage id='Tests.HTTPInvalidReqLine.Name' />,
    info: 'https://ooni.org/nettest/http-invalid-request-line/'
  },
  'http_header_field_manipulation': {
    group: 'middlebox',
    name: <FormattedMessage id='Tests.HTTPHeaderManipulation.Name' />,
    info: 'https://ooni.org/nettest/http-header-field-manipulation/'
  },

  /* IM Tests */
  'facebook_messenger': {
    group: 'im',
    name: <FormattedMessage id='Tests.Facebook.Name' />,
    info: 'https://ooni.org/nettest/facebook-messenger/'
  },
  'telegram': {
    group: 'im',
    name: <FormattedMessage id='Tests.Telegram.Name' />,
    info: 'https://ooni.org/nettest/telegram/'
  },
  'whatsapp': {
    group: 'im',
    name: <FormattedMessage id='Tests.WhatsApp.Name' />,
    info: 'https://ooni.org/nettest/whatsapp/'
  },

  /* Performance */
  'ndt': {
    group: 'performance',
    name: <FormattedMessage id='Tests.NDT.Name' />,
    info: 'https://ooni.org/nettest/ndt/'
  },
  'dash': {
    group: 'performance',
    name: <FormattedMessage id='Tests.Dash.Name' />,
    info: 'https://ooni.org/nettest/dash/'
  },

  /* Censorship circumvention */
  'vanilla_tor': {
    group: 'circumvention',
    name: <FormattedMessage id='Tests.TorVanilla.Name' />,
    info: 'https://ooni.org/nettest/vanilla-tor/'
  },
  'bridge_reachability': {
    group: 'circumvention',
    name: <FormattedMessage id='Tests.BridgeReachability.Name' />,
    info: 'https://ooni.org/nettest/tor-bridge-reachability/'
  },
  'psiphon': {
    group: 'circumvention',
    name: <FormattedMessage id='Tests.Psiphon.Name' />,
    info: 'https://ooni.org/nettest/psiphon/'
  },
  'tor': {
    group: 'circumvention',
    name: <FormattedMessage id='Tests.Tor.Name' />,
    info: 'https://ooni.org/nettest/tor/'
  },
  'riseupvpn': {
    group: 'circumvention',
    name: <FormattedMessage id='Tests.RiseupVPN.Name' />,
    info: 'https://ooni.org/nettest/'
  },

  /* Legacy tests */
  'tcp_connect': {
    group: 'legacy',
    name: <FormattedMessage id='Tests.TCPConnect.Name' />,
    // FIXME: Use a more relevant link
    info: 'https://ooni.org/nettest/'
  },
  'dns_consistency': {
    group: 'legacy',
    name: <FormattedMessage id='Tests.DNSConsistency.Name' />,
    info: 'https://ooni.org/nettest/dns-consistency/'
  },
  'http_requests': {
    group: 'legacy',
    name: <FormattedMessage id='Tests.HTTPRequests.Name' />,
    info: 'https://ooni.org/nettest/http-requests/'
  },
}
