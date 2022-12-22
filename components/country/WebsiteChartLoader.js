import React from 'react'
import PropTypes from 'prop-types'
import ContentLoader from 'react-content-loader'
import { theme } from 'ooni-components'

export const WebsiteChartLoader = (props) => {
  const random = Math.floor(Math.random() * (20 - 14) + 14)
  return (
    <ContentLoader
      height={63}
      width={870}
      speed={1}
      primarycolor={theme.colors.gray3}
      secondarycolor={theme.colors.gray5}
      {...props}
    >
      <rect x="0" y="30" rx="5" ry="5" width={200 - random * 3} height="10" />
      {Array(random).fill('').map((e, i) => (
        <rect key={i} x={250 + (i*20)} y="20" rx="2" ry="2" width="10" height="30" />
      ))
      }
    </ContentLoader>
  )
}

export const WebsiteSectionLoader = ({ rows = 5 }) => (
  <>
    {Array(rows)
      .fill('')
      .map((e, i) => (
        <WebsiteChartLoader key={i} />
      ))
    }
  </>
)

WebsiteSectionLoader.propTypes = {
  rows: PropTypes.number
}

export const AppsChartLoader = ({xOffset = 50, barWidth = 10, barHeight = 30, ...props}) => {
  const random = Math.floor(Math.random() * (20 - 16) + 16)
  return (
    <ContentLoader
      height={66}
      width={850}
      speed={1}
      primarycolor={theme.colors.gray3}
      secondarycolor={theme.colors.gray5}
      {...props}
    >
      {Array(random).fill('').map((e, i) => (
        <rect key={i} x={xOffset + i * barWidth * 2} y="20" rx="2" ry="2" width={barWidth} height={barHeight} />
      ))
      }
    </ContentLoader>
  )
}

export const AppSectionLoader = ({ rows = 1 }) => {
  const Row = ({ y }) => (
    [
      <circle key={0} cx="10" cy={y+5} r="8" />,
      <rect key={1} x="25" y={y} rx="5" ry="5" width="100" height="10" />,
      <rect key={2} x="350" y={y} rx="5" ry="5" width="140" height="10" />,
      <rect key={3} x="725" y={y} rx="5" ry="5" width="80" height="10" />
    ]
  )
  return (
    <ContentLoader
      height={200}
      width={870}
      speed={1}
      primarycolor={theme.colors.gray3}
      secondarycolor={theme.colors.gray5}
    >
      <rect x="0" y="35" rx="5" ry="5" width="200" height="10" />
      {Array(rows).fill('').map((e, i) => (
        <Row key={i} y={70 + (i * 50)} />
      ))}
    </ContentLoader>
  )
}

AppSectionLoader.propTypes = {
  rows: PropTypes.number
}
