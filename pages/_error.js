import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Link from 'next/link'
import {
  Container,
  Flex,
  Box,
  Text,
  Heading
} from 'ooni-components'
import styled from 'styled-components'

import NavBar from '../components/NavBar'
import Layout from '../components/Layout'

const FullHeightFlex = styled(Flex)`
  min-height: 50vh;
`

class ErrorPage extends React.Component {
  static getInitialProps ({ res, xhr }) {
    const errorCode = res ? res.statusCode : ( xhr ? xhr.status : null)
    return { errorCode }
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
    const { errors } = this.props
    return this.render500(errors)
  }
}

ErrorPage.propTypes = {
  errorCode: PropTypes.number.isRequired,
  errors: PropTypes.any
}

export default ErrorPage
