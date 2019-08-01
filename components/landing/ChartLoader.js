import React from 'react'
import ContentLoader from 'react-content-loader'
import { theme } from 'ooni-components'

export const ChartLoader = () => (
  <ContentLoader
    height={200}
    width={450}
    speed={1}
    primaryColor={theme.colors.gray3}
    secondaryColor={theme.colors.gray5}
  >
    <rect x="10" y="0" rx="3" ry="3" width="380" height="6" />
    <rect x="10" y="10" rx="3" ry="3" width="201" height="6" />
    <rect x="10" y="60" rx="5" ry="5" width="5" height="125" />
    <rect x="10" y="180" rx="5" ry="5" width="400" height="5" />
    <rect x="25" y="160" rx="5" ry="5" width="59" height="10" transform="rotate(315, 25, 160)" />
    <rect x="166" y="159" rx="5" ry="5" width="59" height="10" transform="rotate(322, 166, 159)" />
    <rect x="66" y="118" rx="5" ry="5" width="118" height="10" transform="rotate(22, 66, 118)" />
    <rect x="350" y="81" rx="5" ry="5" width="59" height="10" transform="rotate(39, 350, 81)" />
    <rect x="253" y="153" rx="5" ry="5" width="118" height="10" transform="rotate(322, 253, 153)" />
    <rect x="212" y="123" rx="5" ry="5" width="59" height="10" transform="rotate(31, 212, 123)" />
  </ContentLoader>
)
