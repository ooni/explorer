import React from 'react'
import ContentLoader from 'react-content-loader'
import { theme } from 'ooni-components'

export const Loader = () => (
  <ContentLoader
    height={450}
    width={450}
    speed={1}
    primaryColor={theme.colors.gray3}
    secondaryColor={theme.colors.gray5}
  >
    <circle cx="20" cy="33" r="5" />
    <rect x="40" y="30" rx="3" ry="3" width="100" height="5" />
    <rect x="160" y="30" rx="3" ry="3" width="70" height="5" />
    <rect x="250" y="30" rx="3" ry="3" width="70" height="5" />
    <circle cx="20" cy="63" r="5" />
    <rect x="40" y="60" rx="3" ry="3" width="100" height="5" />
    <rect x="160" y="60" rx="3" ry="3" width="70" height="5" />
    <rect x="250" y="60" rx="3" ry="3" width="70" height="5" />
    <circle cx="20" cy="93" r="5" />
    <rect x="40" y="90" rx="3" ry="3" width="100" height="5" />
    <rect x="160" y="90" rx="3" ry="3" width="70" height="5" />
    <rect x="250" y="90" rx="3" ry="3" width="70" height="5" />
    <circle cx="20" cy="123" r="5" />
    <rect x="40" y="120" rx="3" ry="3" width="100" height="5" />
    <rect x="160" y="120" rx="3" ry="3" width="70" height="5" />
    <rect x="250" y="120" rx="3" ry="3" width="70" height="5" />
    <circle cx="20" cy="153" r="5" />
    <rect x="40" y="150" rx="3" ry="3" width="100" height="5" />
    <rect x="160" y="150" rx="3" ry="3" width="70" height="5" />
    <rect x="250" y="150" rx="3" ry="3" width="70" height="5" />
    <circle cx="20" cy="183" r="5" />
    <rect x="40" y="180" rx="3" ry="3" width="100" height="5" />
    <rect x="160" y="180" rx="3" ry="3" width="70" height="5" />
    <rect x="250" y="180" rx="3" ry="3" width="70" height="5" />
    <circle cx="20" cy="213" r="5" />
    <rect x="40" y="210" rx="3" ry="3" width="100" height="5" />
    <rect x="160" y="210" rx="3" ry="3" width="70" height="5" />
    <rect x="250" y="210" rx="3" ry="3" width="70" height="5" />
    <circle cx="20" cy="243" r="5" />
    <rect x="40" y="240" rx="3" ry="3" width="100" height="5" />
    <rect x="160" y="240" rx="3" ry="3" width="70" height="5" />
    <rect x="250" y="240" rx="3" ry="3" width="70" height="5" />
  </ContentLoader>
)
