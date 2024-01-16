import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Box,
  Container,
  Flex,
  Heading,
  Text
} from 'ooni-components'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import NavBar from '../components/NavBar'
import OONI404 from '../public/static/images/OONI_404.svg'

const Custom404 = () => {
  const router = useRouter()
  const intl = useIntl()
  return (
    <>
      <Head>
        <title>{intl.formatMessage({id: 'Error.404.PageNotFound'})}</title>
      </Head>
      <NavBar />
      <Container>
        <Flex alignItems='center' justifyContent='center'>
          <Box>
            <Heading h={4} color='blue5'>
              <FormattedMessage id='Error.404.Heading'/>
            </Heading>
            <Text mb={3}>
              <FormattedMessage
                id='Error.404.Message'
                defaultMessage='We could not find the content you were looking for. Maybe try {measurementLink} or look at {homePageLink}.'
                values={{
                  measurementLink: <FormattedMessage id='Error.404.MeasurmentLinkText'>
                    {message => <Link href='/countries'>{message}</Link>}
                  </FormattedMessage>,
                  homePageLink: <FormattedMessage id='Error.404.HomepageLinkText'>
                    {message => <Link href='/'>{message}</Link>}
                  </FormattedMessage>
                }}
              />
            </Text>
            <Text>
              <FormattedMessage id='Error.404.GoBack'>
                {message =>
                  <a href='' onClick={(e) => {e.preventDefault(); router.back()}}>
                    {message}
                  </a>
                }
              </FormattedMessage>
            </Text>
          </Box>
          <Box p={6}>
            <OONI404 height='500px'/>
          </Box>
        </Flex>
      </Container>
    </>
  )
}

export default Custom404
