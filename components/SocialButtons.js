import React from 'react'
import PropTypes from 'prop-types'
import { Link, Flex } from 'ooni-components'
import { Text } from 'rebass'
import { MdShare } from 'react-icons/lib/md'

function SocialButtons({ url }){
  const text = 'Data from OONI Explorer';
  return(
    <Flex px={2} alignItems='center'>
      <MdShare height='20px' width='20px'/>
      <Text pl={2} textAlign='right'>
        Share on
        <Link color='blue7' target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=https://explorer.ooni.org/${url}`}> Facebook </Link>
        or
        <Link color='blue7' target="_blank" href={`https://twitter.com/intent/tweet?text=${text}&url=https://explorer.ooni.org/${url}`}> Twitter</Link>
      </Text>
    </Flex>
  )
}

SocialButtons.propTypes = {
  url: PropTypes.string.isRequired
}

export default SocialButtons
