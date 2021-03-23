import React from 'react'
import ContentLoader from 'react-content-loader'

const WebsiteStatsChartLoader = (props) => (
  <ContentLoader
    speed={2}
    width={800}
    height={150}
    viewBox="0 0 800 150"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="20" y="5" rx="0" ry="0" width="1" height="170" />
    {Array(16).fill('').map((e, i) => {
      const r = Math.floor(Math.random() * 10)
      return (
        <rect key={i} x={40 + i * 28} y={50 + (r * 10)} rx="0" ry="0" width="15" height={100 - (r * 10)} />
      )
    })}
  </ContentLoader>
)

export default WebsiteStatsChartLoader
