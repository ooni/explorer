import React from 'react'
import ContentLoader from 'react-content-loader'
import { Flex, Box, theme } from 'ooni-components'

export const GlobalLoader = (props) => (
  <Flex flexWrap='wrap'>
    {Array(Math.floor(Math.random() * 3 + 3)).fill('').map((e, i) => (
      <Box width={1/2} my={3} key={i}>
        <ContentLoader
          speed={1}
          width={624}
          height={160}
          viewBox="0 0 624 160"
          primaryColor={theme.colors.gray3}
          secondaryColor={theme.colors.gray5}
          {...props}
        >
          <rect x="70" y="8" rx="3" ry="3" width="32" height="24" />
          <rect x="70" y="40" rx="3" ry="3" width="56" height="6" />
          <circle cx="25" cy="25" r="25" />

          <rect x="3" y="108" rx="0" ry="0" width="200" height="32" />
          <rect x="205" y="108" rx="0" ry="0" width="60" height="32" />
          <rect x="267" y="108" rx="0" ry="0" width="32" height="32" />

          <rect x="551" y="108" rx="0" ry="0" width="32" height="32" />
          <rect x="526" y="13" rx="0" ry="0" width="56" height="32" />
        </ContentLoader>
      </Box>
    ))}
  </Flex>
)
