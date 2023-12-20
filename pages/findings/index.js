import Head from 'next/head'
import NavBar from 'components/NavBar'
import { Container, Heading, Box, Flex, Input, Select, Button, Text } from 'ooni-components'
import { StyledStickyNavBar, StyledStickySubMenu } from 'components/SharedStyledComponents'
import SpinLoader from 'components/vendor/SpinLoader'
import useFilterWithSort from 'hooks/useFilterWithSort'
import useSWR from 'swr'
import { apiEndpoints, fetcher } from '/lib/api'
import HighlightBox from 'components/landing/HighlightBox'
import { styled } from 'styled-components'
import { useIntl } from 'react-intl'
import { useMemo } from 'react'
import useUser from 'hooks/useUser'
import NLink from 'next/link'
import { formatLongDate } from 'utils'

const sortOptions = [
  { key: 'start_asc', intlKey: 'Sort.StartAsc' },
  { key: 'start_desc', intlKey:'Sort.StartDesc' },
  { key: 'end_asc', intlKey: 'Sort.EndAsc' },
  { key: 'end_desc', intlKey: 'Sort.EndDesc' },
]

const StyledGrid = styled(Box)`
display: grid;
grid-template-columns: 1fr 1fr;
gap: 24px;

@media screen and (max-width: 48em) {
  grid-template-columns: 1fr;
}
`

const Index = () => {
  const intl = useIntl()
  const { user } = useUser()

  const { data, isLoading, error } = useSWR(apiEndpoints.SEARCH_INCIDENTS, fetcher)

  const {
    searchValue,
    sortValue,
    setSortValue,
    debouncedSearchHandler
  } = useFilterWithSort({initialSortValue: 'end_desc'})

  const displayData = useMemo(() => {
    if (data) {
      return data.incidents
        .filter((incident) => incident.published)
        .map((incident) => ({
          ...incident,
          start_time: new Date(incident.start_time),
          ...(incident.end_time && {end_time: new Date(incident.end_time)}),
          sort_end_time: incident.end_time ? new Date(incident.end_time) : new Date()
        }))
    } else {
      return []
    }
  }, [data])

  const sortedAndFilteredData = useMemo(() => {
    const sortedData = displayData
      .sort((a, b) => (b.start_time - a.start_time)) // make sure ongoing events are always chronologically sorted
      .sort((a, b) => {
        if (sortValue === 'start_asc') {
          return a.start_time - b.start_time
        } else if (sortValue === 'start_desc') {
          return b.start_time - a.start_time
        } else if (sortValue === 'end_asc') {
          return a.sort_end_time - b.sort_end_time
        } else {
          // default to 'end_desc' sort
          return b.sort_end_time - a.sort_end_time
        }})

    const filteredData = !!searchValue.length ?
      sortedData.filter((incident) => (
        !!searchValue ? 
        incident.title.toLowerCase().includes(searchValue.toLowerCase()) || incident.short_description.toLowerCase().includes(searchValue.toLowerCase()) : 
        true
      )) :
      sortedData

    return filteredData
  }, [displayData, sortValue, searchValue])

  return (
    <>
      <Head>
        <title></title>
      </Head>
      <StyledStickyNavBar>
        <NavBar />
      </StyledStickyNavBar>
      <Container>
        {user?.role === 'admin' && (
          <Flex justifyContent="end" mt={3}><NLink href="/findings/dashboard"><Button hollow>{intl.formatMessage({id: 'Findings.Dashboard.ShortTitle'})}</Button></NLink></Flex>
        )}
        <StyledStickySubMenu>
          <Flex mt={user?.role === 'admin' ? 0 : [0, 5]} mb={2} justifyContent='space-between' alignItems='baseline' flexDirection={['column', 'column', 'row']}>
            <Heading h={1} mt={1} mb={0} fontSize={[4, 5]}>
              {intl.formatMessage({id: 'Findings.Index.Title'}, {amount: sortedAndFilteredData.length})}
            </Heading>
            <Flex sx={{gap: 3}} flexDirection={['column', 'column', 'row']} width={[1, 'auto']}>
              <Box>
                <Input
                  onChange={(e) => debouncedSearchHandler(e.target.value)}
                  placeholder={intl.formatMessage({id: 'Findings.Index.SearchPlaceholder'})}
                  error={
                    (searchValue && sortedAndFilteredData?.length === 0) && 
                    <>{intl.formatMessage({id: 'Findings.Index.SearchError'})}</>
                  }
                />
              </Box>
              <Box>
                <Select value={sortValue} onChange={e => setSortValue(e.target.value)}>
                  {sortOptions.map(({key, intlKey}) => (
                    <option key={key} value={key}>{intl.formatMessage({id: intlKey})}</option>
                  ))}
                </Select>
              </Box>
            </Flex>
          </Flex>
        </StyledStickySubMenu>
        {isLoading && 
          <Container pt={6}><SpinLoader /></Container>
        }
        {!!sortedAndFilteredData?.length && 
          <StyledGrid mt={4}>
            {sortedAndFilteredData.map((incident) => (
              <HighlightBox 
                key={incident.id}
                countryCode={incident.CCs[0]}
                title={incident.title}
                text={incident.short_description}
                dates={
                  <>
                    <Text color="gray6" mb={2}>
                      {incident.start_time && formatLongDate(incident.start_time, intl.locale)} - {incident.end_time ? formatLongDate(incident.end_time, intl.locale) : 'ongoing'}
                    </Text>
                    <Text color="gray6">
                      {intl.formatMessage({id: 'Findings.Index.HighLightBox.CreatedOn'}, {date: incident?.create_time && formatLongDate(incident?.create_time, intl.locale)})}
                    </Text>
                  </>
                }
                footer={
                  <Box textAlign="center" mt={2}>
                    <NLink href={`/findings/${incident.id}`}>
                      <Button size="small" hollow>{intl.formatMessage({id: 'Findings.Index.HighLightBox.ReadMore'})}</Button>
                    </NLink>
                  </Box>
                }
              />
            ))}
          </StyledGrid>
        }
      </Container>
    </>
  )
}

export default Index
