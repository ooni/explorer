import BlockText from 'components/BlockText'
import Calendar from 'components/country/Calendar'
import { Box, Heading, Link, Text } from 'ooni-components'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import FormattedMarkdown from '../FormattedMarkdown'
import { useCountry } from './CountryContext'
import SectionHeader from './SectionHeader'
import { BoxWithTitle } from './boxes'

const ooniBlogBaseURL = 'https://ooni.org'

const FeaturedArticle = ({link, title}) => (
  <Box py={1}>
    <Link color='blue7' href={ooniBlogBaseURL + link} target='_blank' rel='noopener noreferrer'>
      {title}
    </Link>
  </Box>
)

const Overview = ({
  countryName,
  networkCount,
  measurementCount,
  measuredSince,
  featuredArticles = []
}) => {
  const intl = useIntl()
  const { countryCode } = useCountry()

  return (
    <>
      <SectionHeader>
        <SectionHeader.Title name='overview'>
          <FormattedMessage id='Country.Heading.Overview' />
        </SectionHeader.Title>
      </SectionHeader>
      {/* <SummaryText> */}
      <BlockText my={3}>
        <FormattedMarkdown
          id='Country.Overview.SummaryTextTemplate'
          values={{
            measurementCount: intl.formatNumber(measurementCount),
            linkToMeasurements: `/search?probe_cc=${countryCode}`,
            countryName,
            networkCovered: intl.formatNumber(networkCount)
          }}
        />
      </BlockText>
      {/* </SummaryText> */}

      <Heading h={4} my={2}>
        <FormattedMessage id='Country.Overview.Heading.TestsByClass' />
      </Heading>
      <Text fontSize={16}>
        <FormattedMarkdown id='Country.Overview.Heading.TestsByClass.Description' />
      </Text>

      <Calendar startYear={measuredSince} />

      <BoxWithTitle title={<FormattedMessage id='Country.Overview.FeaturedResearch' />}>
        {
          (featuredArticles.length === 0)
            ? <FormattedMessage id='Country.Overview.FeaturedResearch.None' />
            : <ul>
              {featuredArticles.map((article, index) => (
                <li key={index}>
                  <FeaturedArticle link={article.href} title={article.title} />
                </li>
              ))}
            </ul>
        }
      </BoxWithTitle>
      {/* Highlight Box */}
    </>
  )
}
export default Overview
