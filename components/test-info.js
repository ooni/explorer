import React from 'react'

import {
  theme
} from 'ooni-components'

import { FaBeer } from 'react-icons/fa'
import {
  NettestGroupWebsites,
  NettestGroupInstantMessaging,
  NettestGroupMiddleBoxes,
  NettestGroupPerformance,
  NettestGroupCircumvention,
  NettestGroupExperimental
} from 'ooni-components/dist/icons'
import { FormattedMessage } from 'react-intl'


export const testGroups = {
  'websites': {
    'color': theme.colors.indigo5,
    'id': 'Tests.Groups.Websites.Name',
    'name': <FormattedMessage id='Tests.Groups.Websites.Name' />,
    'icon': <NettestGroupWebsites />
  },
  'im': {
    'color': theme.colors.cyan6,
    'id': 'Tests.Groups.Instant Messagging.Name',
    'name': <FormattedMessage id='Tests.Groups.Instant Messagging.Name' />,
    'icon': <NettestGroupInstantMessaging />
  },
  'middlebox': {
    'color': theme.colors.violet8,
    'id': 'Tests.Groups.Middlebox.Name',
    'name': <FormattedMessage id='Tests.Groups.Middlebox.Name' />,
    'icon': <NettestGroupMiddleBoxes />
  },
  'performance': {
    'color': theme.colors.fuchsia6,
    'id': 'Tests.Groups.Performance.Name',
    'name': <FormattedMessage id='Tests.Groups.Performance.Name' />,
    'icon': <NettestGroupPerformance />
  },
  'circumvention': {
    'color': theme.colors.pink6,
    'id': 'Tests.Groups.Circumvention.Name',
    'name': <FormattedMessage id='Tests.Groups.Circumvention.Name' />,
    'icon': <NettestGroupCircumvention />
  },
  'experimental': {
    'color': theme.colors.gray5,
    'id': 'Tests.Groups.Experimental.Name',
    'name': <FormattedMessage id='Tests.Groups.Experimental.Name' />,
    'icon': <NettestGroupExperimental />
  },
  'legacy': {
    'color': theme.colors.gray5,
    'id': 'Tests.Groups.Legacy.Name',
    'name': <FormattedMessage id='Tests.Groups.Legacy.Name' />,
    'icon': <FaBeer />
  },
  'default': {
    'color': theme.colors.gray5,
    'id': 'DefaultTestGroupName',
    'name': null,
    'icon': <FaBeer />
  },
}

export const testNames = {
  /* Websites */
  'web_connectivity': {
    group: 'websites',
    name: <FormattedMessage id='Tests.WebConnectivity.Name' />,
    id: 'Tests.WebConnectivity.Name',
    info: 'https://ooni.org/nettest/web-connectivity/'
  },

  /* Middlebox tests */
  'http_invalid_request_line': {
    group: 'middlebox',
    name: <FormattedMessage id='Tests.HTTPInvalidReqLine.Name' />,
    id: 'Tests.HTTPInvalidReqLine.Name',
    info: 'https://ooni.org/nettest/http-invalid-request-line/'
  },
  'http_header_field_manipulation': {
    group: 'middlebox',
    name: <FormattedMessage id='Tests.HTTPHeaderManipulation.Name' />,
    id: 'Tests.HTTPHeaderManipulation.Name',
    info: 'https://ooni.org/nettest/http-header-field-manipulation/'
  },

  /* IM Tests */
  'facebook_messenger': {
    group: 'im',
    name: <FormattedMessage id='Tests.Facebook.Name' />,
    id: 'Tests.Facebook.Name',
    info: 'https://ooni.org/nettest/facebook-messenger/'
  },
  'telegram': {
    group: 'im',
    name: <FormattedMessage id='Tests.Telegram.Name' />,
    id: 'Tests.Telegram.Name',
    info: 'https://ooni.org/nettest/telegram/'
  },
  'whatsapp': {
    group: 'im',
    name: <FormattedMessage id='Tests.WhatsApp.Name' />,
    id: 'Tests.WhatsApp.Name',
    info: 'https://ooni.org/nettest/whatsapp/'
  },
  'signal': {
    group: 'im',
    name: <FormattedMessage id='Tests.Signal.Name' />,
    id: 'Tests.Signal.Name',
    info: 'https://ooni.org/nettest/signal/'
  },

  /* Performance */
  'ndt': {
    group: 'performance',
    name: <FormattedMessage id='Tests.NDT.Name' />,
    id: 'Tests.NDT.Name',
    info: 'https://ooni.org/nettest/ndt/'
  },
  'dash': {
    group: 'performance',
    name: <FormattedMessage id='Tests.Dash.Name' />,
    id: 'Tests.Dash.Name',
    info: 'https://ooni.org/nettest/dash/'
  },

  /* Censorship circumvention */
  'bridge_reachability': {
    group: 'legacy',
    name: <FormattedMessage id='Tests.BridgeReachability.Name' />,
    id: 'Tests.BridgeReachability.Name',
    info: 'https://ooni.org/nettest/tor-bridge-reachability/'
  },
  'psiphon': {
    group: 'circumvention',
    name: <FormattedMessage id='Tests.Psiphon.Name' />,
    id: 'Tests.Psiphon.Name',
    info: 'https://ooni.org/nettest/psiphon/'
  },
  'tor': {
    group: 'circumvention',
    name: <FormattedMessage id='Tests.Tor.Name' />,
    id: 'Tests.Tor.Name',
    info: 'https://ooni.org/nettest/tor/'
  },
  'torsf': {
    group: 'circumvention',
    name: <FormattedMessage id='Tests.TorSnowflake.Name' />,
    id: 'Tests.TorSnowflake.Name',
    info: 'https://ooni.org/nettest/torsf/'
  },
  'riseupvpn': {
    group: 'circumvention',
    name: <FormattedMessage id='Tests.RiseupVPN.Name' />,
    id: 'Tests.RiseupVPN.Name',
    info: 'https://ooni.org/nettest/'
  },

  /* Legacy tests */
  'tcp_connect': {
    group: 'legacy',
    name: <FormattedMessage id='Tests.TCPConnect.Name' />,
    id: 'Tests.TCPConnect.Name',
    // FIXME: Use a more relevant link
    info: 'https://ooni.org/nettest/'
  },
  'dns_consistency': {
    group: 'legacy',
    name: <FormattedMessage id='Tests.DNSConsistency.Name' />,
    id: 'Tests.DNSConsistency.Name',
    info: 'https://ooni.org/nettest/dns-consistency/'
  },
  'http_requests': {
    group: 'legacy',
    name: <FormattedMessage id='Tests.HTTPRequests.Name' />,
    id: 'Tests.HTTPRequests.Name',
    info: 'https://ooni.org/nettest/http-requests/'
  },
  'http_host': {
    group: 'legacy',
    name: <FormattedMessage id='Tests.HTTPHost.Name' />,
    id: 'Tests.HTTPHost.Name',
    info: 'https://ooni.org/nettest/http-host/'
  },
  'meek_fronted_requests_test': {
    group: 'legacy',
    name: <FormattedMessage id='Tests.MeekFrontendRequests.Name' />,
    id: 'Tests.MeekFrontendRequests.Name',
    info: 'https://ooni.org/nettest/meek-fronted-requests/'
  },
  'multi_protocol_traceroute': {
    group: 'legacy',
    name: <FormattedMessage id='Tests.MultiProtocolTraceroute.Name' />,
    id: 'Tests.MultiProtocolTraceroute.Name',
    info: 'https://ooni.org/nettest/'
  },

  /* Experimental tests */
  'vanilla_tor': {
    group: 'experimental',
    name: <FormattedMessage id='Tests.TorVanilla.Name' />,
    id: 'Tests.TorVanilla.Name',
    info: 'https://ooni.org/nettest/vanilla-tor/'
  },
  'dnscheck': {
    group: 'experimental',
    name: <FormattedMessage id='Tests.DNSCheck.Name' />,
    id: 'Tests.DNSCheck.Name',
    info: 'https://ooni.org/nettest/http-requests/'
  },
  'stunreachability': {
    group: 'experimental',
    name: <FormattedMessage id='Tests.StunReachability.Name' />,
    id: 'Tests.StunReachability.Name',
    info: 'https://ooni.org/nettest/http-requests/'
  },
  'urlgetter': {
    group: 'experimental',
    name: <FormattedMessage id='Tests.URLGetter.Name' />,
    id: 'Tests.URLGetter.Name',
    info: 'https://ooni.org/nettest/http-requests/'
  },
  'browser_web': {
    group: 'experimental',
    name: <FormattedMessage id='Tests.ProbeWeb.Name' />,
    id: 'Tests.ProbeWeb.Name',
    info: 'https://github.com/ooni/spec/blob/master/nettests/ts-036-browser_web.md'
  }
}
