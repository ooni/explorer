import { Flex, Heading, Box, Text, Button } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import NLink from 'next/link'

const CallToActionBox = ({title, text}) => {
  return (
    <Flex my={4} bg='gray3' flexWrap='wrap'>
      <Box width={1} mx={4} my={2}>
        <Heading h={4}>
          {title}
        </Heading>
        <Text fontSize={2}>
          {text}
        </Text>
      </Box>
      <Flex alignItems='center' mx={4} my={4} flexDirection={['column', 'row']}>
        <Box mr={4} mb={[3, 0]}>
          <NLink href='https://ooni.org/install'>
            <a>
              <Button>
                <FormattedMessage id='Country.Overview.NoData.Button.InstallProbe' />
              </Button>
            </a>
          </NLink>
        </Box>
      </Flex>
    </Flex>
  )
}

export default CallToActionBox