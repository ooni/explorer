import Head from 'next/head'
import NLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Container, Flex, Heading, Text } from 'ooni-components'
import React, { useEffect, useState } from 'react'

import NavBar from 'components/NavBar'
import LoginForm from 'components/login/LoginForm'
import SpinLoader from 'components/vendor/SpinLoader'
import useUser from 'hooks/useUser'
import { FormattedMessage, useIntl } from 'react-intl'

const Login = () => {
  const intl = useIntl()
  const router = useRouter()
  const { token } = router.query

  const [submitted, setSubmitted] = useState(false)

  const redirectTo = typeof window !== 'undefined' && window.location.origin

  const { user, loading, error } = useUser()

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (!loading && user && !token) {
      router.replace('/')
    }
  }, [user, loading, router, token])

  return (
    <>
      <Head>
        <title>{intl.formatMessage({id: 'General.Login'})}</title>
      </Head>
      <NavBar />

      <Container>
        <Flex alignItems='center' flexDirection='column'>
          <Heading h={1} mt={3} mb={1} fontSize={[3, 5]}>
            <FormattedMessage id="General.Login" />
          </Heading>
        </Flex>
        <Flex mt={4} flexDirection='column'>
          {/* Before logging In */}
          {!token && !submitted &&
            <>
              <Text fontSize={1} mb={2} textAlign='center'>
                <FormattedMessage id="Login.EnterEmail" />
              </Text>
              <Box style={{width: '300px'}} alignSelf='center'>
                <LoginForm onLogin={() => setSubmitted(true)} redirectTo={redirectTo} />
              </Box>
            </>
          }
          {!token && submitted &&
            <Heading h={3} width={[1, 2 / 3]} textAlign='center' mx='auto'>
              <FormattedMessage id="Login.Submitted" />
            </Heading>
          }

          {/* While logging In */}
          {token && !user && !error &&
            <>
              <SpinLoader />
              <Heading h={2} my={2} mx='auto'>
                <FormattedMessage id="Login.LoggingIn" />
              </Heading>
            </>
          }

          {/* After loggin in */}
          {user && !error && token &&
            <>
              <Text fontSize={3} my={2} mx='auto'>
                <FormattedMessage id="Login.Success" />
              </Text>
            </>
          }

          {/* Errors */}
          {error &&
            <Box width={[1, 1 / 3]} mx='auto' textAlign={'center'}>
              <Box mb={3} p={4} bg='red1'>{error}</Box>
              <NLink href='/login'><FormattedMessage id="Login.Failure" /></NLink>
            </Box>
          }
        </Flex>
      </Container>
    </>
  )
}

export default Login
