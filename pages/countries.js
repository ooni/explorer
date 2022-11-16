import React, { useMemo, useState } from 'react'
import Head from 'next/head'
import NLink from 'next/link'
import axios from 'axios'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import debounce from 'lodash.debounce'
import {
  Flex, Box,
  Container,
  Link, Input,
  Heading, Text
} from 'ooni-components'
import { StickyContainer, Sticky } from 'react-sticky'

import Flag from '../components/Flag'
import NavBar from '../components/NavBar'

import countryUtil from 'country-util'
import { getLocalisedRegionName } from 'utils/i18nCountries'

const CountryLink = styled(Link)`
  color: ${props => props.theme.colors.black};
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.colors.blue5};
  }
`

const StyledCountryCard = styled(Box)`
  border: 1px solid ${props => props.theme.colors.gray3};
`

const Divider = styled.div`
  border: 1px solid ${props => props.theme.colors.gray3};
  margin-bottom: 12px;
`

const CountryBlock = ({countryCode, msmtCount}) => {
  const intl = useIntl()
  const href = `/country/${countryCode}`
  return (
    <Box width={[1/2, 1/4]} my={3} px={3}>
      <StyledCountryCard p={3}>
        <NLink href={href}>
          <CountryLink href={href}>
            <Flex flexDirection='column'>
              <Flag center border countryCode={countryCode} size={48} />
              <Text py={2} fontSize={[20, 24]} style={{height: '100px'}}>{getLocalisedRegionName(countryCode, intl.locale)}</Text>
              <Divider />
              <Flex alignItems={['flex-start', 'center']} flexDirection={['column', 'row']}>
                <Text mr={2} fontSize={20} fontWeight={600} color='blue9'><FormattedNumber value={msmtCount} /></Text>
                <Text>{intl.formatMessage({id: 'Home.Banner.Stats.Measurements'})}</Text>
              </Flex>
            </Flex>
          </CountryLink>
        </NLink>
      </StyledCountryCard>
    </Box>
  )
}

// To compenstate for the sticky navigation bar
// :target selector applies only the element with id that matches
// the current URL fragment (e.g '/#Africa')
const RegionHeaderAnchor = styled.div`
  :target::before {
    content: ' ';
    display: block;
    width: 0;
    /* Height of the combined header (NavBar and Regions) */
    /* This is needed to compensate the for the sticky navbar and region
       links bar when scrolling to the selected region. And the height of these
       bars changes in the mobile layout. This has evolved to be a bad design
       that needs to be replaced. */
    height: 145px;
    margin-top: -145px;
    @media(max-width: 768px) {
      height: 375px;
      margin-top: -375px;
    }
  }
`

const RegionBlock = ({regionCode, countries}) => {
  const intl = useIntl()

  countries = countries
    .map((c) => ({...c, localisedName: getLocalisedRegionName(c.alpha_2, intl.locale)}))
    .sort((a, b) => (new Intl.Collator(intl.locale).compare(a.localisedName, b.localisedName)))

  const regionName = getLocalisedRegionName(regionCode, intl.locale)
  // Select countries in the region where we have measuremennts from
  const measuredCountriesInRegion = countryUtil.regions[regionCode].countries.filter((countryCode) => (
    countries.find((item) => item.alpha_2 === countryCode)
  ))

  // When there are no measurements from the region
  if (measuredCountriesInRegion.length === 0) {
    return null
  }

  return (
    <Box my={3}>
      <RegionHeaderAnchor id={regionName} />
      <Heading h={1} center py={2}>{regionName}</Heading>
      <Flex flexWrap='wrap' py={2}>
        {countries
          .filter((c => ( measuredCountriesInRegion.indexOf(c.alpha_2) > -1 )))
          .map((country, index) => (
            <CountryBlock key={index} countryCode={country.alpha_2} msmtCount={country.count} />
          ))
        }
      </Flex>
    </Box>
  )
}

// Raise the Sticky Header to avoid the flags getting rendered over it
const RaisedHeader = styled.div`
  z-index: 100;
`

const RegionMenu = styled.div`
  background-color: white;
  border-bottom: 1px solid ${props => props.theme.colors.gray3};
`
const StyledRegionLink = styled.a`
  display: block;
  color: ${(props) => props.theme.colors.blue5};
  text-decoration: none;
  border-bottom: 2px solid transparent;
  :hover {
    border-bottom: 2px solid ${(props) => props.theme.colors.blue5};
    width: 100%;
  }
`

const RegionLink = ({ href, label }) => (
  <Box px={[1,3]} py={[2,4]}>
    <StyledRegionLink href={href}>
      <Text fontSize={[16, 20]}>{label}</Text>
    </StyledRegionLink>
  </Box>
)


const NoCountriesFound = ({ searchTerm }) => (
  <Flex justifyContent='center'>
    <Box width={1/2} m={5}>
      <Text textAlign='center' fontSize={5}>
        {/* TODO Add to copy */}
        <FormattedMessage
          id='Countries.Search.NoCountriesFound'
          values={{ searchTerm: `"${searchTerm}"` }}
        />
      </Text>
    </Box>
  </Flex>
)

export const getServerSideProps = async () => {
  const client = axios.create({baseURL: process.env.NEXT_PUBLIC_OONI_API}) // eslint-disable-line
    const result = await client.get('/api/_/countries')
    const responseUrl = result?.request?.res?.responseUrl

    return {
      props: {
        countries: result.data.countries,
      }  
    }
}

const Countries = ({countries}) => {
  const intl = useIntl()
  const [searchInput, setSearchInput] = useState('')

  let filteredCountries = countries

  if (searchInput !== '') {
    filteredCountries = countries.filter((country) => (
      country.name.toLowerCase().indexOf(searchInput.toLowerCase()) > -1
    ))
  }

  const searchHandler = (searchTerm) => {
    setSearchInput(searchTerm)
  }

  const debouncedSearchHandler = useMemo(() => debounce(searchHandler, 200), [])

  // Africa Americas Asia Europe Oceania Antarctica
  const regions = ['002', '019', '142', '150', '009', 'AQ']

  return (
    <React.Fragment>
      <Head>
        <title>Internet Censorship around the world | OONI Explorer</title>
      </Head>

      <StickyContainer>
        <Sticky>
          {({ style }) => (
            <RaisedHeader style={style}>
              <NavBar />
              <RegionMenu>
                <Container>
                  <Flex
                    flexDirection={['column', 'row']}
                    justifyContent={['flex-start', 'flex-end']}
                    alignItems={['flex-start', 'center']}
                  >
                    <Box my={2}>
                      <Input
                        onChange={(e) => debouncedSearchHandler(e.target.value)}
                        placeholder={intl.formatMessage({id: 'Countries.Search.Placeholder'})}
                        error={filteredCountries.length === 0}
                      />
                    </Box>
                    <RegionLink href={`#${getLocalisedRegionName('002', intl.locale)}`} label={getLocalisedRegionName('002', intl.locale)} />
                    <RegionLink href={`#${getLocalisedRegionName('019', intl.locale)}`} label={getLocalisedRegionName('019', intl.locale)} />
                    <RegionLink href={`#${getLocalisedRegionName('142', intl.locale)}`} label={getLocalisedRegionName('142', intl.locale)} />
                    <RegionLink href={`#${getLocalisedRegionName('150', intl.locale)}`} label={getLocalisedRegionName('150', intl.locale)} />
                    <RegionLink href={`#${getLocalisedRegionName('009', intl.locale)}`} label={getLocalisedRegionName('009', intl.locale)} />
                    <RegionLink href={`#${getLocalisedRegionName('AQ', intl.locale)}`} label={getLocalisedRegionName('AQ', intl.locale)} />
                  </Flex>
                </Container>
              </RegionMenu>
            </RaisedHeader>
          )}
        </Sticky>
        <Container>
          {
            // Show a message when there are no countries to show, when search is empty
            (filteredCountries.length === 0)
              ? <NoCountriesFound searchTerm={searchInput} />
              : regions.map((regionCode, index) => (
                <RegionBlock key={index} regionCode={regionCode} countries={filteredCountries} />
              ))
          }
        </Container>
      </StickyContainer>
    </React.Fragment>
  )
}

export default Countries
