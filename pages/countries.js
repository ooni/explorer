import axios from 'axios'
import CountryList from 'components/CountryBox'
import countryUtil from 'country-util'
import debounce from 'lodash.debounce'
import Head from 'next/head'
import { Input } from 'ooni-components'
import { useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { getLocalisedRegionName } from 'utils/i18nCountries'
import { StickySubMenu } from '../components/SharedStyledComponents'

const Regions = ({ regions, countries }) => {
  return regions.map((regionCode, index) => {
    const measuredCountriesInRegion = countryUtil.regions[
      regionCode
    ].countries.filter((countryCode) =>
      countries.find((item) => item.alpha_2 === countryCode),
    )

    return (
      <RegionBlock
        key={index}
        regionCode={regionCode}
        countries={countries.filter(
          (c) => measuredCountriesInRegion.indexOf(c.alpha_2) > -1,
        )}
      />
    )
  })
}

const RegionBlock = ({ regionCode, countries }) => {
  const intl = useIntl()
  const regionName = useMemo(
    () => getLocalisedRegionName(regionCode, intl.locale),
    [regionCode, intl],
  )

  // When there are no measurements from the region
  if (countries.length === 0) {
    return null
  }

  return (
    <div className="my-4">
      <div
        className="h-[200px] mt-[-200px] md:h-[140px] md:mt-[-140px]"
        id={regionName}
      />
      <h2 className="py-2">{regionName}</h2>
      <CountryList countries={countries} itemsPerRow={4} />
    </div>
  )
}

export const RegionLink = ({ href, label }) => (
  <a className="px-2 md:px-4 block text-blue-500 underline" href={href}>
    {label}
  </a>
)

const NoCountriesFound = ({ searchTerm }) => (
  <div className="flex justify-center">
    <div className="w-1/2 m-16">
      <div className="text-center text-5xl">
        <FormattedMessage
          id="Countries.Search.NoCountriesFound"
          values={{ searchTerm: `"${searchTerm}"` }}
        />
      </div>
    </div>
  </div>
)

export const getStaticProps = async () => {
  const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
  const result = await client.get('/api/_/countries')

  return {
    props: {
      countries: result.data.countries,
    },
    revalidate: 60 * 60 * 12, // 12 hours
  }
}

const Countries = ({ countries }) => {
  const intl = useIntl()
  const [searchInput, setSearchInput] = useState('')

  const sortedCountries = useMemo(
    () =>
      countries
        .map((c) => ({
          ...c,
          localisedName: getLocalisedRegionName(c.alpha_2, intl.locale),
        }))
        .sort((a, b) =>
          new Intl.Collator(intl.locale).compare(
            a.localisedName,
            b.localisedName,
          ),
        ),
    [intl, countries],
  )

  const filteredCountries = useMemo(
    () =>
      searchInput !== ''
        ? sortedCountries.filter(
            (country) =>
              country.localisedName
                .toLowerCase()
                .indexOf(searchInput.toLowerCase()) > -1,
          )
        : sortedCountries,
    [searchInput],
  )

  const searchHandler = (searchTerm) => {
    setSearchInput(searchTerm)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const debouncedSearchHandler = useMemo(() => debounce(searchHandler, 200), [])

  // Africa Americas Asia Europe Oceania Antarctica
  const regions = ['002', '019', '142', '150', '009', 'AQ']

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'Countries.PageTitle' })}</title>
      </Head>
      <div className="container">
        <StickySubMenu title={intl.formatMessage({ id: 'Navbar.Countries' })}>
          <div className="flex flex-col md:flex-row justify-start md:justify-end items-start md:items-center">
            <div className="my-2">
              <Input
                onChange={(e) => debouncedSearchHandler(e.target.value)}
                placeholder={intl.formatMessage({
                  id: 'Countries.Search.Placeholder',
                })}
                error={filteredCountries.length === 0}
              />
            </div>
            <div className="flex flex-row flex-wrap">
              <RegionLink
                href={`#${getLocalisedRegionName('002', intl.locale)}`}
                label={getLocalisedRegionName('002', intl.locale)}
              />
              <RegionLink
                href={`#${getLocalisedRegionName('019', intl.locale)}`}
                label={getLocalisedRegionName('019', intl.locale)}
              />
              <RegionLink
                href={`#${getLocalisedRegionName('142', intl.locale)}`}
                label={getLocalisedRegionName('142', intl.locale)}
              />
              <RegionLink
                href={`#${getLocalisedRegionName('150', intl.locale)}`}
                label={getLocalisedRegionName('150', intl.locale)}
              />
              <RegionLink
                href={`#${getLocalisedRegionName('009', intl.locale)}`}
                label={getLocalisedRegionName('009', intl.locale)}
              />
              <RegionLink
                href={`#${getLocalisedRegionName('AQ', intl.locale)}`}
                label={getLocalisedRegionName('AQ', intl.locale)}
              />
            </div>
          </div>
        </StickySubMenu>

        {
          // Show a message when there are no countries to show, when search is empty
          filteredCountries.length === 0 ? (
            <NoCountriesFound searchTerm={searchInput} />
          ) : (
            <Regions regions={regions} countries={filteredCountries} />
          )
        }
      </div>
    </>
  )
}

export default Countries
