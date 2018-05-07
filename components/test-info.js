import {
  theme
} from 'ooni-components'

import FaBeer from 'react-icons/lib/fa/beer'

export const testGroups = {
  'websites': {
    'color': theme.colors.indigo5,
    'name': 'Websites',
    'icon': <FaBeer />
  },
  'im': {
    'color': theme.colors.cyan6,
    'name': 'Instant Messagging',
    'icon': <FaBeer />
  },
  'middlebox': {
    'color': theme.colors.violet8,
    'name': 'Middlebox',
    'icon': <FaBeer />
  },
  'performance': {
    'color': theme.colors.fuschia6,
    'name': 'Performance',
    'icon': <FaBeer />
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
    name: 'Web Connectivity'
  },

  /* Middlebox tests */
  'http_invalid_request_line': {
    group: 'middlebox',
    name: 'HTTP Invalid Request Line'
  },
  'http_header_field_manipulation': {
    group: 'middlebox',
    name: 'HTTP Header Field Manipulation'
  },

  /* IM Tests */
  'facebook_messenger': {
    group: 'im',
    name: 'Facebook Messenger'
  },
  'telegram': {
    group: 'im',
    name: 'Telegram'
  },
  'whatsapp': {
    group: 'im',
    name: 'WhatsApp'
  },

  /* Performance */
  'ndt': {
    group: 'performance',
    name: 'NDT Speed Test'
  },
  'dash': {
    group: 'performance',
    name: 'Dash video streaming'
  },

  /* Censorship circumvention */
  'vanilla_tor': {
    group: 'circumvention',
    name: 'Tor (Vanilla)'
  },
  'bridge_reachability': {
    group: 'circumvention',
    name: 'Tor Bridge Reachability'
  },

  /* Legacy tests */
  'tcp_connect': {
    group: 'legacy',
    name: 'TCP Connect'
  },
  'dns_consistency': {
    group: 'legacy',
    name: 'DNS Consistency'
  },
  'http_requests': {
    group: 'legacy',
    name: 'HTTP Requests'
  },
}
