import Head from 'next/head'
import { Container } from 'ooni-components'
import { apiEndpoints, fetcher } from '/lib/api'

import NotFound from 'components/NotFound'
import FindingDisplay from 'components/findings/FindingDisplay'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'

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

  const metaTitle = useMemo(() => (
    `${intl.formatMessage({ id: 'General.OoniExplorer' })}${!!data?.incident?.title && ` - ${data?.incident?.title}`}`
  ), [data, intl])
  const metaDescription = useMemo(() => (data?.incident?.short_description || ''), [data])

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta key="og:title" property="og:title" content={metaTitle} />
        <meta key="og:description" property="og:description" content={metaDescription} />
        <meta key="twitter:title" name="twitter:title" content={metaTitle} />
        <meta key="twitter:description" name="twitter:description" content={metaDescription} />
      </Head>
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
