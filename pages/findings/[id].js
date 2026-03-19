import Head from 'next/head'
import { apiEndpoints, fetcher } from '/lib/api'

import NotFound from 'components/NotFound'
import FindingDisplay from 'components/findings/FindingDisplay'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'

export const getServerSideProps = async ({ query, req }) => {
  const data = await fetcher(
    apiEndpoints.SHOW_INCIDENT.replace(':id', query.id),
  ).catch(() => null)

  return {
    props: {
      data,
      isEmbeddedView: !!req.headers['enable-embedded-view'] || !!query?.webview,
    },
  }
}

const ReportView = ({ data }) => {
  const intl = useIntl()

  const metaTitle = useMemo(
    () =>
      `${intl.formatMessage({ id: 'General.OoniExplorer' })}${!!data?.incident?.title && ` - ${data?.incident?.title}`}`,
    [data, intl],
  )
  const metaDescription = useMemo(
    () => data?.incident?.short_description || '',
    [data],
  )

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta key="og:title" property="og:title" content={metaTitle} />
        <meta
          key="og:description"
          property="og:description"
          content={metaDescription}
        />
        <meta key="twitter:title" name="twitter:title" content={metaTitle} />
        <meta
          key="twitter:description"
          name="twitter:description"
          content={metaDescription}
        />
      </Head>
      <div className="container">
        {data ? (
          <FindingDisplay incident={data.incident} />
        ) : (
          <NotFound
            title={intl.formatMessage({ id: 'Findings.Display.NotFound' })}
          />
        )}
      </div>
    </>
  )
}

export default ReportView
