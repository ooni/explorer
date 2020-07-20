import React from 'react'
import { Link, Box } from 'ooni-components'
import { Text } from 'rebass'
import { TiSocialFacebook, TiSocialTwitter } from 'react-icons/lib/ti'

export default function SocialButtons({ url, fontSize, color }){
  return(
    <>
      <Box px={1}>
        <Link color={color} target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=https://explorer.ooni.org/${url}`}>
            <TiSocialFacebook size={fontSize}/>
        </Link>
      </Box>
      <Box px={1}>
        <Link color={color} target="_blank" href={`https://twitter.com/intent/tweet?url=https://explorer.ooni.org/${url}`}>
            <TiSocialTwitter size={fontSize}/>
        </Link>
      </Box>
    </>
  )
}
