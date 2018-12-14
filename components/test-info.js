import React from 'react'

import {
  theme
} from 'ooni-components'

import FaBeer from 'react-icons/lib/fa/beer'
import {
  NettestGroupWebsites,
  NettestGroupInstantMessaging,
  NettestGroupMiddleBoxes,
  NettestGroupPerformance
} from 'ooni-components/dist/icons'


export const testGroups = {
  'websites': {
    'color': theme.colors.indigo5,
    'name': 'Websites',
    'icon': <NettestGroupWebsites />
  },
  'im': {
    'color': theme.colors.cyan6,
    'name': 'Instant Messagging',
    'icon': <NettestGroupInstantMessaging />
  },
  'middlebox': {
    'color': theme.colors.violet8,
    'name': 'Middlebox',
    'icon': <NettestGroupMiddleBoxes />
  },
  'performance': {
    'color': theme.colors.fuschia6,
    'name': 'Performance',
    'icon': <NettestGroupPerformance />
  },
  'circumvention': {
    'color': '',
    'name': 'Circumvention',
    'icon': <FaBeer />
  },
  'legacy': {
    'color': theme.colors.gray5,
    'name': 'Legacy',
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
    name: 'Web Connectivity',
    info: 'https://ooni.io/nettest/web-connectivity/'
  },

  /* Middlebox tests */
  'http_invalid_request_line': {
    group: 'middlebox',
    name: 'HTTP Invalid Request Line',
    info: 'https://ooni.io/nettest/http-invalid-request-line/'
  },
  'http_header_field_manipulation': {
    group: 'middlebox',
    name: 'HTTP Header Field Manipulation',
    info: 'https://ooni.io/nettest/http-header-field-manipulation/'
  },

  /* IM Tests */
  'facebook_messenger': {
    group: 'im',
    name: 'Facebook Messenger',
    info: 'https://ooni.io/nettest/facebook-messenger/'
  },
  'telegram': {
    group: 'im',
    name: 'Telegram',
    info: 'https://ooni.io/nettest/telegram/'
  },
  'whatsapp': {
    group: 'im',
    name: 'WhatsApp',
    info: 'https://ooni.io/nettest/whatsapp/'
  },

  /* Performance */
  'ndt': {
    group: 'performance',
    name: 'NDT Speed Test',
    info: 'https://ooni.io/nettest/ndt/'
  },
  'dash': {
    group: 'performance',
    name: 'Dash video streaming',
    info: 'https://ooni.io/nettest/dash/'
  },

  /* Censorship circumvention */
  'vanilla_tor': {
    group: 'circumvention',
    name: 'Tor (Vanilla)',
    info: 'https://ooni.io/nettest/vanilla-tor/'
  },
  'bridge_reachability': {
    group: 'circumvention',
    name: 'Tor Bridge Reachability',
    info: 'https://ooni.io/nettest/tor-bridge-reachability/'
  },

  /* Legacy tests */
  'tcp_connect': {
    group: 'legacy',
    name: 'TCP Connect',
    // FIXME: Use a more relevant link
    info: 'https://ooni.io/nettest/'
  },
  'dns_consistency': {
    group: 'legacy',
    name: 'DNS Consistency',
    info: 'https://ooni.io/nettest/dns-consistency/'
  },
  'http_requests': {
    group: 'legacy',
    name: 'HTTP Requests',
    info: 'https://ooni.io/nettest/http-requests/'
  },
}
