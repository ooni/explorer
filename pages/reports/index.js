import Head from 'next/head'
import NLink from 'next/link'
import NavBar from '../../components/NavBar'
import { Button, Container, Heading, Box, Link, Text, Flex } from 'ooni-components'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '/lib/api'
import useUser from 'hooks/useUser'

const ReportIndex = () => {
  const { user } = useUser()
  const { data, error } = useSWR(apiEndpoints.SEARCH_INCIDENTS, fetcher)

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1}>Incident Reports</Heading>
        {data?.incidents.map((incident) => (
          <Flex my={2} key={incident.id} justifyContent="space-between" alignItems="center">
            <NLink href={`/reports/${incident.id}`} passHref>
              <Link>
                <Heading h={4}>{incident.title}</Heading>
              </Link>
            </NLink>
            <Text>{incident.published ? 'published' : 'not published'}</Text>
            {user?.role === 'admin' && (
              <NLink href={`/reports/edit/${incident.id}`}>
                <Button type="button" hollow>
                  Edit
                </Button>
              </NLink>
            )}
          </Flex>
        ))}
        {!!user && (
          <NLink href="/reports/create">
            <Button type="button" hollow>
              + Add Report
            </Button>
          </NLink>
        )}
      </Container>
    </>
  )
}

export default ReportIndex
