import Head from 'next/head'
import NLink from 'next/link'
import NavBar from '../../components/NavBar'
import { Button, Container, Heading, Box, Link, Text, Flex } from 'ooni-components'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '/lib/api'
import useUser from 'hooks/useUser'

const IncidentsDashboard = () => {
  const { user } = useUser()
  const { data, error } = useSWR(apiEndpoints.SEARCH_INCIDENTS, fetcher)

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1}>Incidents Dashboard</Heading>
        {data?.incidents.map((incident) => (
          <Flex my={2} key={incident.id} justifyContent="space-between" alignItems="center">
            <NLink href={`/incidents/${incident.id}`} passHref>
              <Link>
                <Heading h={4}>{incident.title}</Heading>
              </Link>
            </NLink>
            <Text>{incident.published ? 'published' : 'not published'}</Text>
            {user?.role === 'admin' && (
              <NLink href={`/incidents/edit/${incident.id}`}>
                <Button type="button" hollow>
                  Edit
                </Button>
              </NLink>
            )}
          </Flex>
        ))}
        {!!user && (
          <NLink href="/incidents/create">
            <Button type="button" hollow>
              + Add Incident
            </Button>
          </NLink>
        )}
      </Container>
    </>
  )
}

export default IncidentsDashboard
