import React from 'react'
import ContentLoader from 'react-content-loader'
import { theme } from 'ooni-components'

export const ChartLoader = () => (
  <ContentLoader
    height={200}
    width={450}
    speed={1}
    primarycolor={theme.colors.gray3}
    secondarycolor={theme.colors.gray5}
  >
    <rect x="20" y="17" rx="0" ry="0" width="1" height="129" />
    <rect x="20" y="146" rx="0" ry="0" width="360" height="1" />
    <rect x="379" y="17" rx="0" ry="0" width="1" height="129" />
    <rect x="200" y="17" rx="0" ry="0" width="1" height="129" />

    <rect x="54" y="155" rx="3" ry="3" width="16" height="4" />
    <rect x="78" y="155" rx="3" ry="3" width="66" height="4" />

    <rect x="154" y="155" rx="3" ry="3" width="16" height="4" />
    <rect x="178" y="155" rx="3" ry="3" width="66" height="4" />

    <rect x="254" y="155" rx="3" ry="3" width="16" height="4" />
    <rect x="278" y="155" rx="3" ry="3" width="66" height="4" />

  </ContentLoader>
)
