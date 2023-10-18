import { Flex, Box, Heading, Text } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

const StyledBox = styled(Box)`
text-align: center;
background-color: ${props => props.theme.colors.gray2};
`

export const NoCharts = ({ message }) => {
  return (
    <Flex flexDirection='column' justifyContent='center' sx={{ height: '100%' }}>
      <Text fontSize={2} fontWeight={600} mb={2}>
        <FormattedMessage id="MAT.Charts.NoData.Title" />
      </Text>
      <StyledBox p={4} fontWeight={600}>
        <FormattedMessage id="MAT.Charts.NoData.Description" />
        <Box>
          {message &&
            <Box p={2} m={2}>
              <FormattedMessage id='MAT.Charts.NoData.Details' />
              <Box as='pre' my={2}>
                {message}
              </Box>
            </Box>
          }
        </Box>
      </StyledBox>
    </Flex>
  )
}
