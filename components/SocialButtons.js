import React from 'react'
import PropTypes from 'prop-types'
import { Link, Flex, Text } from 'ooni-components'
import { MdShare } from 'react-icons/md'
import { useIntl } from 'react-intl'

const SocialButtons = ({ url }) => {
  const intl = useIntl()

  return(
    <Flex px={2} alignItems='center'>
      <MdShare height='20px' width='20px'/>
      <Text pl={2} textAlign='right'>
        {intl.formatMessage(
          {id: 'SocialButtons.CTA'},
          {
            'facebook-link': (string) => (<Link color='blue7' target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=https://explorer.ooni.org/${url}`}>{string}</Link>),
            'twitter-link': (string) => (<Link color='blue7' target="_blank" href={`https://twitter.com/intent/tweet?text=${intl.formatMessage({id: 'SocialButtons.Text'})}&url=https://explorer.ooni.org/${url}`}>{string}</Link>)
          }
        )}
      </Text>
    </Flex>
  )
}

SocialButtons.propTypes = {
  url: PropTypes.string.isRequired
}

export default SocialButtons
