import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Container,
  Box,
  Flex,
  Text,
  Heading
} from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import NavBar from '../components/NavBar'
import OONI404 from '../public/static/images/OONI_404.svg'

export default function Custom404() {
  const router = useRouter()
  return (
    <React.Fragment>
      <Head>
        <title> Page Not Found </title>
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
                defaultMessage='We could not find the content you were looking for. Maybe try {measurmentLink} or look at {homePageLink}.'
                values={{
                  measurmentLink: <FormattedMessage id='Error.404.MeasurmentLinkText'>
                    {message => <Link href='/countries'><a>{message}</a></Link>}
                  </FormattedMessage>,
                  homePageLink: <FormattedMessage id='Error.404.HomepageLinkText'>
                    {message => <Link href='/'><a>{message}</a></Link>}
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
    </React.Fragment>
  )
}
