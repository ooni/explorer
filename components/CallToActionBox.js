import NLink from 'next/link'
import { Box, Button, Flex, Heading, Text } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

const CallToActionBox = ({title, text}) => {
  return (
    <Flex p={3} bg='gray3' flexWrap='wrap' minHeight='180px'>
      <Box mb={2}>
        <Heading h={4} m={0}>
          {title}
        </Heading>
        <Text fontSize={1}>
          {text}
        </Text>
      </Box>
      <NLink href='https://ooni.org/install'>
        <Button>
          <FormattedMessage id='Country.Overview.NoData.Button.InstallProbe' />
        </Button>
      </NLink>
    </Flex>
  )
}

export default CallToActionBox