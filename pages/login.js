import React, { useCallback, useEffect, useState } from 'react'
import { Box, Flex, Heading, Text, Link } from 'ooni-components'
import { useRouter } from 'next/router'
import NLink from 'next/link'
import Head from 'next/head'

import NavBar from 'components/NavBar'
import Layout from 'components/Layout'
import LoginForm from 'components/login/LoginForm'
import { mutate } from 'swr'
import SpinLoader from 'components/vendor/SpinLoader'
import useUser from 'hooks/useUser'
import { FormattedMessage } from 'react-intl'

const Login = () => {
  const router = useRouter()
  const { token } = router.query

  const redirectTo = typeof window !== 'undefined' && window.location.origin

  const { user, loading, submitted, setSubmitted, loggedIn, reqError } = useUser()

  // // If user is already logged in, redirect to home page
  // useEffect(() => {
  //   // if (!loading && user.loggedIn) {
  //   //   router.replace('/')
  //   // }
  // }, [user, loading, router])

  return (
    <Layout title='Login'>
      <Head>
        <title>Login</title>
      </Head>
      <NavBar />

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
            <LoginForm onLogin={() => setSubmitted(true)} redirectTo={redirectTo} />
          </>
        }
        {!token && submitted &&
          <Heading h={3} width={[1, 2 / 3]} textAlign='center' mx='auto'>
            <FormattedMessage id="Login.Submitted" />
          </Heading>
        }

        {/* While logging In */}
        {token && !loggedIn && !reqError &&
          <>
            <SpinLoader />
            <Heading h={2} my={2} mx='auto'>
              <FormattedMessage id="Login.LoggingIn" />
            </Heading>
          </>
        }

        {/* After loggin in */}
        {loggedIn && !reqError &&
          <>
            <Heading h={2} my={2} mx='auto'>
              <FormattedMessage id="Login.Success" />
            </Heading>
          </>
        }

        {/* Errors */}
        {reqError &&
          <Box width={[1, 1 / 3]} mx='auto' textAlign={'center'}>
            <Box mb={3} p={4} bg='red1'>{reqError}</Box>
            <NLink href='/login'><FormattedMessage id="Login.Failure" /></NLink>
          </Box>
        }
      </Flex>
    </Layout>
  )
}

export default Login
