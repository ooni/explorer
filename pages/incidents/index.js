import Head from 'next/head'
import NLink from 'next/link'
import NavBar from '../../components/NavBar'
import { Button, Container, Heading, Box, Link, Text, Flex } from 'ooni-components'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '/lib/api'
import useUser from 'hooks/useUser'
import ReportBox from '../../components/ReportBox'
import { styled } from 'styled-components'

const StyledGrid = styled(Box)`
display: grid;
grid-template-columns: 1fr 1fr;
grid-auto-rows: 1fr;
gap: 24px;
`
const ReportIndex = () => {
  const { user } = useUser()
  const { data, error } = useSWR(`${apiEndpoints.SEARCH_INCIDENTS}?published=true`, fetcher)

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <NavBar />
      <Container>
        <Heading h={1}>Incidents</Heading>
        <StyledGrid>
          {data?.incidents.map((incident) => (
            <ReportBox 
              key={incident.id}
              id={incident.id}
              country={incident.CCs[0]}
              title={incident.title}
              startDate={incident.start_time}
              endDate={incident.end_time}
            />
          ))}
        </StyledGrid>
      </Container>
    </>
  )
}

export default ReportIndex
