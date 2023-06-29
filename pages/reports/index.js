import Head from 'next/head'
import NLink from 'next/link'
import NavBar from '../../components/NavBar'
import { Button, Container, Heading, Box, Link, Text, Flex } from 'ooni-components'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '/lib/api'

const ReportIndex = () => {
  const { data, error } = useSWR(apiEndpoints.SEARCH_INCIDENTS, fetcher)
  console.log('DATA', data)
  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1}>INDEX</Heading>
        {data?.incidents.map((incident) => (
          <Flex my={2} key={incident.id} justifyContent="space-between" alignItems="end">
            <NLink href={`/reports/${incident.id}`} passHref>
              <Link>
                <Heading h={3}>{incident.title}</Heading>
              </Link>
            </NLink>
            <Text>{incident.published ? 'published' : 'not published'}</Text>
            <NLink href={`/reports/edit/${incident.id}`}>
              <Button type="button">Edit</Button>
            </NLink>
          </Flex>
        ))}
        <NLink href="/reports/create">
          <Button type="button">+ Add Report</Button>
        </NLink>
      </Container>
    </>
  )
}

export default ReportIndex
