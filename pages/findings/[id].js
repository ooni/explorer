import Head from 'next/head'
import NavBar from 'components/NavBar'
import { Container } from 'ooni-components'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '/lib/api'
import { useRouter } from 'next/router'

import SpinLoader from 'components/vendor/SpinLoader'
import NotFound from 'components/NotFound'
import FindingDisplay from 'components/findings/FindingDisplay'
import { useIntl } from 'react-intl'
import { useMemo } from 'react'

export const getServerSideProps = async ({ query }) => {
  const data = await fetcher(apiEndpoints.SHOW_INCIDENT.replace(':id', query.id)).catch(() => (null))

  return {
    props: {
      data,
    }
  }
}

const ReportView = ({ data }) => {
  const intl = useIntl()

  const metaTitle = useMemo(() => (data?.incident?.title || intl.formatMessage({ id: 'General.OoniExplorer' })), [data])
  const metaDescription = useMemo(() => (data?.incident?.short_description || ''), [data])

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta
          key="og:title"
          property="og:title"
          content={metaTitle}
        />
        <meta
          key="og:description"
          property="og:description"
          content={metaDescription}
        />
      </Head>
      <NavBar />
      <Container>
        {data ?
          <FindingDisplay incident={data.incident} /> :
          <NotFound title={intl.formatMessage({id: 'Findings.Display.NotFound'})} />
        }
      </Container>
    </>
  )
}

export default ReportView
