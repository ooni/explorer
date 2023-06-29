import Head from 'next/head'
import NavBar from '/components/NavBar'
import { Container, Heading } from 'ooni-components'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '/lib/api'
import { useRouter } from 'next/router'
import Markdown from 'markdown-to-jsx'
import MAT from '../../components/reports/mat'

const FormattedMarkdown = ({ children }) => {
  return (
    <Markdown
      options={{
        overrides: {
          // a: {
          //   component: Link,
          //   props: {
          //     color: theme.colors.blue7
          //   }
          // },
          MAT: {
            component: MAT,
          },
        },
      }}
    >
      {children}
    </Markdown>
  )
}

const ReportView = () => {
  const { query } = useRouter()

  const { data, error } = useSWR(
    query.incident_id
      ? apiEndpoints.SHOW_INCIDENT.replace(':incident_id', query.incident_id)
      : null,
    fetcher
  )

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        {data && (
          <>
            <Heading h={1}>{data.incident.title}</Heading>
            <p>Published: {data.incident.published}</p>
            <p>Reported by {data.incident.reported_by}</p>
            <p>Start time: {data.incident.start_time}</p>
            <p>Tags: {JSON.stringify(data.incident.tags)}</p>
            <p>ASNs: {JSON.stringify(data.incident.ASNs)}</p>
            <p>CCs: {JSON.stringify(data.incident.CCs)}</p>
            <p>Domains: {JSON.stringify(data.incident.domains)}</p>
            <FormattedMarkdown>{data.incident.text}</FormattedMarkdown>
          </>
        )}
      </Container>
    </>
  )
}

export default ReportView
