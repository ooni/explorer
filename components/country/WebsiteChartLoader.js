import React from 'react'
import PropTypes from 'prop-types'
import ContentLoader from 'react-content-loader'
import { theme } from 'ooni-components'

export const WebsiteChartLoader = (props) => {
  const random = Math.floor(Math.random() * (20 - 14) + 14)
  return (
    <ContentLoader
      height={70}
      width={850}
      speed={1}
      primaryColor={theme.colors.gray3}
      secondaryColor={theme.colors.gray5}
      {...props}
    >
      <rect x="0" y="15" rx="5" ry="5" width="100" height="10" />
      {Array(random).fill('').map((e, i) => (
        <rect key={i} x={240 + (i*20)} y="0" rx="5" ry="5" width="10" height="30" />
      ))
      }
    </ContentLoader>
  )
}

export const WebsiteSectionLoader = ({ rows = 5 }) => (
  <React.Fragment>
    {Array(rows)
      .fill('')
      .map((e, i) => (
        <WebsiteChartLoader key={i} />
      ))
    }
  </React.Fragment>
)

WebsiteSectionLoader.propTypes = {
  rows: PropTypes.number
}
