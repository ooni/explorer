import axios from 'axios'
import debounce from 'lodash.debounce'
import Head from 'next/head'
import {
  Box,
  Container, Flex, Heading, Input, Text
} from 'ooni-components'
import React, { useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'

import CountryList from 'components/CountryBox'
import { StyledStickySubMenu } from 'components/SharedStyledComponents'
import countryUtil from 'country-util'
import { getLocalisedRegionName } from 'utils/i18nCountries'

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

  const sortedCountries = useMemo(() => (countries
      .map((c) => ({...c, localisedName: getLocalisedRegionName(c.alpha_2, intl.locale)}))
      .sort((a, b) => (new Intl.Collator(intl.locale).compare(a.localisedName, b.localisedName)))
    ), 
    [intl, countries]
  )

  const regionName = useMemo(() => (getLocalisedRegionName(regionCode, intl.locale)), [regionCode, intl])
  // Select countries in the region where we have measuremennts from
  const measuredCountriesInRegion = useMemo(() => (
    countryUtil.regions[regionCode].countries.filter((countryCode) => (
      sortedCountries.find((item) => item.alpha_2 === countryCode)
    ),
    [sortedCountries])
  ))

  // When there are no measurements from the region
  if (measuredCountriesInRegion.length === 0) {
    return null
  }

  return (
    <Box my={3}>
      <RegionHeaderAnchor id={regionName} />
      <Heading h={1} center py={2}>{regionName}</Heading>
      <CountryList 
        countries={countries.filter((c => ( measuredCountriesInRegion.indexOf(c.alpha_2) > -1 ))).map((c) => ({country: c.alpha_2, measurements: c.count}))}
        itemsPerRow={4}
      />
    </Box>
  )
}

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
  <Box px={[2,3]} py={[2,2,4]}>
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

export const getStaticProps = async () => {
  const client = axios.create({baseURL: process.env.NEXT_PUBLIC_OONI_API}) // eslint-disable-line
  const result = await client.get('/api/_/countries')

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
    <>
      <Head>
        <title>{intl.formatMessage({id: 'Countries.PageTitle'})}</title>
      </Head>
      <StyledStickySubMenu>
        <Container>
          <Flex
            flexDirection={['column', 'column', 'row']}
            justifyContent={['flex-start', 'flex-end']}
            alignItems={['flex-start', 'flex-start', 'center']}
          >
            <Box my={2}>
              <Input
                onChange={(e) => debouncedSearchHandler(e.target.value)}
                placeholder={intl.formatMessage({id: 'Countries.Search.Placeholder'})}
                error={filteredCountries.length === 0}
              />
            </Box>
            <Flex
              flexDirection='row'
              flexWrap='wrap'
            >
              <RegionLink href={`#${getLocalisedRegionName('002', intl.locale)}`} label={getLocalisedRegionName('002', intl.locale)} />
              <RegionLink href={`#${getLocalisedRegionName('019', intl.locale)}`} label={getLocalisedRegionName('019', intl.locale)} />
              <RegionLink href={`#${getLocalisedRegionName('142', intl.locale)}`} label={getLocalisedRegionName('142', intl.locale)} />
              <RegionLink href={`#${getLocalisedRegionName('150', intl.locale)}`} label={getLocalisedRegionName('150', intl.locale)} />
              <RegionLink href={`#${getLocalisedRegionName('009', intl.locale)}`} label={getLocalisedRegionName('009', intl.locale)} />
              <RegionLink href={`#${getLocalisedRegionName('AQ', intl.locale)}`} label={getLocalisedRegionName('AQ', intl.locale)} />
            </Flex>
          </Flex>
        </Container>
      </StyledStickySubMenu>

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
    </>
  )
}

export default Countries
