import React from 'react'
import PropTypes from 'prop-types'
import ContentLoader from 'react-content-loader'
import { theme } from 'ooni-components'

export const LoaderRow = (props) => {
  const isWide = (Math.random() * 100) > 70
  const random = Math.random() * (1 - 0.7) + 0.7
  return (
  <ContentLoader
    height={40}
    width={450}
    speed={1}
    primaryColor={theme.colors.gray3}
    secondaryColor={theme.colors.gray5}
    {...props}
  >
    <rect x="0" y="15" rx="5" ry="5" width="30" height="10" />
    <circle x="30" cx="45" cy="20" r="8" />
    {<rect x="60" y="15" rx="5" ry="5" width={200*random} height="10" />}
    {isWide && <rect x="280" y="15" rx="5" ry="5" width="120" height="10" />}
  </ContentLoader>
  )
}


export const Loader = ({ rows = 10 }) => (
  <React.Fragment>
  {Array(rows)
  .fill('')
  .map((e, i) => (
    <LoaderRow key={i} style={{ opacity: Number(2 / i).toFixed(1) }} />
  ))}
  </React.Fragment>
)

Loader.propTypes = {
  rows: PropTypes.number
}
