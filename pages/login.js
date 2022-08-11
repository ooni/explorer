import React, { useCallback, useEffect, useState } from 'react'
import { Box, Flex, Heading, Text, Link } from 'ooni-components'
import { useRouter } from 'next/router'
import NLink from 'next/link'
import Head from 'next/head'

import NavBar from 'components/NavBar'
import Layout from 'components/Layout'
import LoginForm from 'components/login/LoginForm'
import { loginUser } from '/lib/api'
import { mutate } from 'swr'
import SpinLoader from 'components/vendor/SpinLoader'
import useUser from 'hooks/useUser'

export async function getServerSideProps(context) {
  const referer = context.req.headers.referer && 
    (new URL(context.req.headers.referer).hostname === 
      new URL(process.env.NEXT_PUBLIC_EXPLORER_URL).hostname) ? 
    context.req.headers.referer : 
    null

  return { 
    props: {
      referer
    }
  }
}

const Login = ({ referer }) => {
  const router = useRouter()
  const { token } = router.query

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
        <Heading h={1} mt={3} mb={1} fontSize={[3, 5]}>Login</Heading>
      </Flex>
      <Flex mt={4} flexDirection='column'>
        {/* Before logging In */}
        {!token && !submitted &&
          <>
            <Text fontSize={1} mb={2} textAlign='center'>Add your email address and click the link sent to your email to log in. <br/>We do not store email addresses.</Text>
            <LoginForm onLogin={() => setSubmitted(true)} redirectTo={referer} />
          </>
        }
        {!token && submitted &&
          <Heading h={3} width={[1, 2 / 3]} textAlign='center' mx='auto'>
            Your login request has been submitted. Please check your email for a link to activate and log in to your account.
          </Heading>
        }

        {/* While logging In */}
        {token && !loggedIn && !reqError &&
          <>
            <SpinLoader />
            <Heading h={2} my={2} mx='auto'> Logging in... </Heading>
          </>
        }

        {/* After loggin in */}
        {loggedIn && !reqError &&
          <>
            <Heading h={2} my={2} mx='auto'> Logged in. Redirecting to the measurement... </Heading>
          </>
        }

        {/* Errors */}
        {reqError &&
          <Box width={[1, 1 / 3]} mx='auto' textAlign={'center'}>
            <Box mb={3} p={4} bg='red1'>{reqError}</Box>
            <NLink href='/login'>Try logging in again</NLink>
          </Box>
        }
      </Flex>
    </Layout>
  )
}

export default Login
