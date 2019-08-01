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
  </ContentLoader>
)
