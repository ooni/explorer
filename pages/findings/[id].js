import Head from 'next/head'
import { apiEndpoints, fetcher } from 'lib/api'

import FindingDisplay from 'components/findings/FindingDisplay'
import StructuredData from 'components/StructuredData'
import { getFindingStructuredData } from 'lib/findingStructuredData'
import { useIntl } from 'react-intl'

export const getServerSideProps = async ({ query, req, res }) => {
  try {
    const data = await fetcher(
      apiEndpoints.SHOW_INCIDENT.replace(':id', query.id),
    )

    if (!data?.incident) {
      res.setHeader('Cache-Control', 'no-store')
      return { notFound: true }
    }

    const { incident } = data
    const paramId = String(query.id) 

    if (
      String(incident.id) === paramId &&
      incident.slug
    ) {
      return {
        redirect: {
          destination: `/findings/${incident.slug}`,
          permanent: true,
        },
      }
    }

    const pathId = incident.slug || paramId
    const canonicalUrl = `${process.env.NEXT_PUBLIC_EXPLORER_URL}/findings/${pathId}`

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=600, stale-while-revalidate=60',
    )

    return {
      props: {
        data,
        canonicalUrl,
        structuredData: getFindingStructuredData(incident, canonicalUrl),
        isEmbeddedView:
          !!req.headers['enable-embedded-view'] || !!query?.webview,
      },
    }
  } catch (error) {
    res.setHeader('Cache-Control', 'no-store')
    return { notFound: true }
  }
}

const ReportView = ({ data, canonicalUrl, structuredData }) => {
  const intl = useIntl()

  const metaTitle = `${!!data?.incident?.title && `${data?.incident?.title} | `}${intl.formatMessage({ id: 'General.OoniExplorer' })}`
  const metaDescription = data?.incident?.short_description

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
        <link rel="canonical" key="canonical" href={canonicalUrl} />
        {structuredData && (
          <StructuredData data={structuredData} />
        )}
      </Head>
      <div className="container">
        <FindingDisplay incident={data.incident} />
      </div>
    </>
  )
}

export default ReportView
