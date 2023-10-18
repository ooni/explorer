import React from 'react'
import PropTypes from 'prop-types'
import prettyMs from 'pretty-ms'
import { Flex, Box, Link, Text } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import { MdOpenInNew } from 'react-icons/md'
import { getTestMetadata } from '../utils'

import TestGroupBadge from '../Badge'
import SocialButtons from '../SocialButtons'

const DetailsHeader = ({testName, runtime, notice, url}) => {
  const metadata = getTestMetadata(testName)

  return (
    <>
      <Flex pt={4} pb={2} alignItems={['flex-end', 'center']} flexDirection={['column', 'row']}>
        <Flex mb={[3, 0]} alignItems='center'>
          <Box>
            <TestGroupBadge testName={testName} />
          </Box>
          <Box ml={2}>
            <Link color='blue7' href={metadata.info}>
              <Text fontSize={20}>
                {metadata.name}
                &nbsp;
                <small><MdOpenInNew /></small>
              </Text>
            </Link>
          </Box>
        </Flex>
        <Box mx='auto'>
          {notice}
        </Box>
        <Box>
          {runtime &&
            <Text fontSize={20}>
              <FormattedMessage id='Measurement.DetailsHeader.Runtime' />: <Text as='span' fontWeight='bold'>{prettyMs(runtime * 1000)}</Text>
            </Text>
          }
        </Box>
      </Flex>
      <Flex pb={4} pt={2} alignItems={['flex-start', 'flex-end']}>
        <SocialButtons url={url}/>
      </Flex>
    </>
  )
}

DetailsHeader.propTypes = {
  testName: PropTypes.string.isRequired,
  runtime: PropTypes.number.isRequired,
  notice: PropTypes.any
}

export default DetailsHeader
