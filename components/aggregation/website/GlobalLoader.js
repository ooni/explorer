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
          style={{margin: '0px 16px', backgroundColor: 'white'}}
          {...props}
        >
          <circle cx="35" cy="30" r="20" />
          <rect x="70" y="12" rx="3" ry="3" width="32" height="24" />
          <rect x="70" y="42" rx="3" ry="3" width="56" height="6" />

          <rect x="20" y="108" rx="0" ry="0" width="200" height="32" />
          <rect x="222" y="108" rx="0" ry="0" width="60" height="32" />
          <rect x="284" y="108" rx="0" ry="0" width="32" height="32" />

          <rect x="551" y="108" rx="0" ry="0" width="32" height="32" />
          <rect x="526" y="13" rx="0" ry="0" width="56" height="32" />
        </ContentLoader>
      </Box>
    ))}
  </Flex>
)
