import axios from 'axios'
import debounce from 'lodash.debounce'
import Head from 'next/head'
import {
  Box,
  Container, Flex, Heading, Input, Link, Text
} from 'ooni-components'
import React, { useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'

import CountryList from 'components/CountryBox'
import { StyledStickySubMenu } from 'components/SharedStyledComponents'
import countryUtil from 'country-util'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import { StickySubMenu } from '../components/SharedStyledComponents'

// To compenstate for the sticky navigation bar
// :target selector applies only the element with id that matches
// the current URL fragment (e.g '/#Africa')
const RegionHeaderAnchor = styled.div`
  /* Height of the combined header (NavBar and Regions) */
  /* This is needed to compensate the for the sticky navbar and region
      links bar when scrolling to the selected region. And the height of these
      bars changes in the mobile layout. This has evolved to be a bad design
      that needs to be replaced. */
  height: 172px;
  margin-top: -172px;
  @media(max-width: 768px) {
    height: 375px;
    margin-top: -375px;
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
      <Heading h={2} py={2}>{regionName}</Heading>
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
  text-decoration: underline;
`

const RegionLink = ({ href, label }) => (
  <Box px={[2,3]}>
    <StyledRegionLink href={href}>
      <Text fontSize={1}>{label}</Text>
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
    <>
      <Head>
        <title>{intl.formatMessage({id: 'Countries.PageTitle'})}</title>
      </Head>
      <Container>
        <StickySubMenu title="Countries">
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
        </StickySubMenu>
      
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
