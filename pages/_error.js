// import React from 'react'
// import PropTypes from 'prop-types'
// import Head from 'next/head'
// import Link from 'next/link'
// import {
//   Container,
//   Flex,
//   Box,
//   Text,
//   Heading
// } from 'ooni-components'
// import styled from 'styled-components'

// import NavBar from '../components/NavBar'
// import Layout from '../components/Layout'

// const FullHeightFlex = styled(Flex)`
//   min-height: 50vh;
// `

// class ErrorPage extends React.Component {
//   static getInitialProps ({ res, xhr }) {
//     const errorCode = res ? res.statusCode : ( xhr ? xhr.status : null)
//     return { errorCode }
//   }

//   render500 (errors) {
//     return (
//       <Layout>
//         <Head>
//           <title> Unknown Error </title>
//         </Head>
//         <NavBar />
//         <Container>
//           <FullHeightFlex alignItems='center' justifyContent='center' flexDirection='column'>
//             <Heading h={4}>
//               There was an unexpected error from our end.
//             </Heading>
//             <Text my={4}>
//               Maybe try <Link href='/countries'><a>exploring some measurements</a></Link> or go to our <Link href='/'><a>homepage</a></Link>.
//             </Text>
//             {errors && <Box as='pre' bg='gray1' p={2}>
//               {JSON.stringify(errors, null, 2)}
//             </Box>}
//           </FullHeightFlex>
//         </Container>
//       </Layout>
//     )
//   }

//   render () {
//     const { errors } = this.props
//     return this.render500(errors)
//   }
// }

// ErrorPage.propTypes = {
//   errorCode: PropTypes.number.isRequired,
//   errors: PropTypes.any
// }

// export default ErrorPage

import NextErrorComponent from 'next/error'
import * as Sentry from '@sentry/nextjs'

const ErrorPage = ({ statusCode, hasGetInitialPropsRun, err }) => {
  if (!hasGetInitialPropsRun && err) {
    // getInitialProps is not called in case of
    // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
    // err via _app.js so it can be captured
    Sentry.captureException(err)
    // Flushing is not required in this case as it only happens on the client
  }

  console.error(err)

  return <NextErrorComponent statusCode={statusCode} />
}

ErrorPage.getInitialProps = async ({ res, err, asPath }) => {
  const errorInitialProps = await NextErrorComponent.getInitialProps({
    res,
    err,
  })

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  errorInitialProps.hasGetInitialPropsRun = true

  // Running on the server, the response object (`res`) is available.
  //
  // Next.js will pass an err on the server if a page's data fetching methods
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an err if:
  //
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html

  if (err) {
    Sentry.captureException(err)

    // Flushing before returning is necessary if deploying to Vercel, see
    // https://vercel.com/docs/platform/limits#streaming-responses
    await Sentry.flush(2000)

    return errorInitialProps
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
  )
  await Sentry.flush(2000)

  return errorInitialProps
}

export default ErrorPage