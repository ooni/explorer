import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import {
  Container,
  Flex,
  Box,
  Text,
  Heading
} from 'ooni-components'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import NavBar from '../components/NavBar'
import Layout from '../components/Layout'
import OONI404 from '../public/static/images/OONI_404.svg'

const FullHeightFlex = styled(Flex)`
  min-height: 50vh;
`

class ErrorPage extends React.Component {
  static getInitialProps ({ res, xhr }) {
    const errorCode = res ? res.statusCode : ( xhr ? xhr.status : null)
    return { errorCode }
  }

  render404 () {
    return (
      <Layout>
        <Head>
          <title> Page Not Found </title>
        </Head>
        <NavBar />
        <Container>
          <FullHeightFlex alignItems='center' justifyContent='center'>
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
                    <Link href='#'>
                      <a onClick={(e) => {e.preventDefault(); Router.back()}}>
                        {message}
                      </a>
                    </Link>}
                </FormattedMessage>
              </Text>
            </Box>
            <Box p={6}>
              <OONI404 height='500px'/>
            </Box>
          </FullHeightFlex>
        </Container>
      </Layout>
    )
  }

  render500 (errors) {
    return (
      <Layout>
        <Head>
          <title> Unknown Error </title>
        </Head>
        <NavBar />
        <Container>
          <FullHeightFlex alignItems='center' justifyContent='center' flexDirection='column'>
            <Heading h={4}>
              There was an unexpected error from our end.
            </Heading>
            <Text my={4}>
              Maybe try <Link href='/countries'><a>exploring some measurements</a></Link> or go to our <Link href='/'><a>homepage</a></Link>.
            </Text>
            {errors && <Box as='pre' bg='gray1' p={2}>
              {JSON.stringify(errors, null, 2)}
            </Box>}
          </FullHeightFlex>
        </Container>
      </Layout>
    )
  }

  render () {
    const { errorCode, errors } = this.props
    if (errorCode === 404) {
      return this.render404()
    }
    return this.render500(errors)
  }
}

ErrorPage.propTypes = {
  errorCode: PropTypes.number.isRequired,
  errors: PropTypes.any
}

export default ErrorPage
