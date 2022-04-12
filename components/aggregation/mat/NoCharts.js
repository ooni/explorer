import { Flex, Box, Heading } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

export const NoCharts = ({ message }) => {
  return (
    <Flex flexDirection='column' justifyContent='center' sx={{ height: '100%' }}>
      <Heading h={4}>
        <FormattedMessage id='MAT.Charts.NoData.Title' />
      </Heading>
      <Heading h={5}>
        <FormattedMessage id='MAT.Charts.NoData.Description' />
      </Heading>
      {message &&
        <Box bg='gray1' p={2} m={2}>
          Details:
          <Box as='pre' my={2}>
            {message}
          </Box>
        </Box>
      }
    </Flex>
  )
}