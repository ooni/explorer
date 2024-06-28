/* global process */
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from 'ooni-components'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import styled from 'styled-components'
import { twMerge } from 'tailwind-merge'
import FormattedMarkdown from '../components/FormattedMarkdown'
import HighlightSection from '../components/landing/HighlightsSection'
import CoverageChart from '../components/landing/Stats'
import highlightContent from '../components/landing/highlights.json'
import { toCompactNumberUnit } from '../utils'

const HeroUnit = styled.div`
  background: linear-gradient(
    319.33deg,
    ${(props) => props.theme.colors.blue9} 39.35%,
    ${(props) => props.theme.colors.base} 82.69%),
    ${(props) => props.theme.colors.base};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  padding-bottom: 48px;
  padding-top: 16px;
`

const StatsItem = ({ label, unit, value }) => (
  <div className="text-center" color="blue9" width={[1 / 3]} p={3}>
    <div className="text-4xl md:text-5xl font-light">
      {value}
      <span className="text-3xl" as="span">
        {unit}
      </span>
    </div>
    <div className="text-gray-800">{label}</div>
  </div>
)

StatsItem.propTypes = {
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  unit: PropTypes.string,
  value: PropTypes.number,
}

const FeatureRow = ({ className, ...props }) => (
  <div
    className={twMerge(
      'flex flex-wrap items-center justify-center py-8',
      className,
    )}
    {...props}
  />
)

const FeatureBox = ({ className, ...props }) => (
  <div
    className={twMerge('w-full md:w-1/2 leading-normal text-xl', className)}
    {...props}
  />
)

const FeatureBoxTitle = ({ className, ...props }) => (
  <div
    className={twMerge(
      'flex text-blue-1000 text-2xl font-bold mb-2',
      className,
    )}
    {...props}
  />
)

export async function getServerSideProps({ query }) {
  const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API }) // eslint-disable-line
  const result = await client.get('/api/_/global_overview')

  return {
    props: {
      measurementCount: result.data.measurement_count,
      asnCount: result.data.network_count,
      countryCount: result.data.country_count,
    },
  }
}

const LandingPage = ({ measurementCount, asnCount, countryCount }) => {
  const intl = useIntl()
  measurementCount = toCompactNumberUnit(measurementCount)
  asnCount = toCompactNumberUnit(asnCount)

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'General.OoniExplorer' })}</title>
      </Head>
      <HeroUnit>
        <div className="container mx-auto bg-no-repeat bg-center bg-[url('/static/images/world-dots.svg')] md:py-[120px] md:my-[90px] pt-16 md:pt-0">
          <div className="text-center">
            <h1>
              <div className="text-3xl md:text-6xl text-white">
                <FormattedMessage id="Home.Banner.Title.UncoverEvidence" />
              </div>
            </h1>
            <div className="text-lg md:text-2xl text-blue-200">
              <FormattedMessage id="Home.Banner.Subtitle.ExploreCensorshipEvents" />
            </div>
            <Link href="/chart/mat">
              <Button size="xLarge" hollow mt={48} px={5} inverted>
                <FormattedMessage id="Home.Banner.Button.Explore" />
              </Button>
            </Link>
          </div>
        </div>
      </HeroUnit>
      <div className="container mx-auto">
        <div className="flex flex-wrap rounded-2xl bg-white md:px-8 md:py-4 md:mx-[25%] md:mt-[-120px] md:mb-12">
          <StatsItem
            label={<FormattedMessage id="Home.Banner.Stats.Measurements" />}
            unit={measurementCount.unit}
            value={measurementCount.value}
          />
          <StatsItem
            label={<FormattedMessage id="Home.Banner.Stats.Countries" />}
            value={countryCount}
          />
          <StatsItem
            label={<FormattedMessage id="Home.Banner.Stats.Networks" />}
            unit={asnCount.unit}
            value={asnCount.value}
          />
        </div>

        {/* Intro text about Explorer */}
        <div className="flex justify-center my-8">
          <div className="w-full md:w-2/3 text-xl leading-normal">
            <FormattedMarkdown id="Home.About.SummaryText" />
          </div>
        </div>

        {/* Websites & Apps */}
        <FeatureRow>
          <FeatureBox>
            <img
              className="w-full"
              src="/static/images/websites-apps.png"
              alt="Websites and Apps"
            />
          </FeatureBox>
          <FeatureBox color="gray7">
            <FeatureBoxTitle>
              <FormattedMessage id="Home.Websites&Apps.Title" />
            </FeatureBoxTitle>
            <FormattedMessage id="Home.Websites&Apps.SummaryText" />
          </FeatureBox>
        </FeatureRow>
        {/* Search & Filter */}
        {/* Arrange in {[img, para], [img, para], [img, para]} pattern on smaller screens */}
        <FeatureRow flexDirection={['column-reverse', 'row']}>
          <FeatureBox color="gray7">
            <FeatureBoxTitle>
              <FormattedMessage id="Home.Search&Filter.Title" />
            </FeatureBoxTitle>
            <FormattedMessage id="Home.Search&Filter.SummaryText" />
          </FeatureBox>
          <FeatureBox>
            <img
              className="w-full"
              src="/static/images/search.png"
              alt="Search and Filter"
            />
          </FeatureBox>
        </FeatureRow>
        {/* Network Properties */}
        <FeatureRow>
          <FeatureBox>
            <img
              className="w-full"
              src="/static/images/network-performance.png"
              alt="Network Properties"
            />
          </FeatureBox>
          <FeatureBox color="gray7">
            <FeatureBoxTitle>
              <FormattedMessage id="Home.NetworkProperties.Title" />
            </FeatureBoxTitle>
            <FormattedMessage id="Home.NetworkProperties.SummaryText" />
          </FeatureBox>
        </FeatureRow>
        {/* Measurement Statistics */}
        <div className="container mx-auto mb-16">
          <div className="flex justify-center my-4">
            <h2 className="text-blue-800">
              <FormattedMessage id={'Home.MonthlyStats.Title'} />
            </h2>
          </div>
          <CoverageChart />
        </div>
        {/* Highlights */}
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center my-4">
            <h2 className="text-blue-800">
              <a id="highlights">
                <FormattedMessage id={'Home.Highlights.Title'} />
              </a>
            </h2>
          </div>
          <div className="flex flex-wrap justify-center">
            <div className="md:px-8 my-4 text-center text-2xl">
              <FormattedMarkdown id="Home.Highlights.Description" />
            </div>
          </div>

          {/* Political Events */}
          <HighlightSection
            title={<FormattedMessage id="Home.Highlights.Political" />}
            description={
              <FormattedMessage id="Home.Highlights.Political.Description" />
            }
            highlights={highlightContent.political}
          />
          {/* Media */}
          <HighlightSection
            title={<FormattedMessage id="Home.Highlights.Media" />}
            description={
              <FormattedMessage id="Home.Highlights.Media.Description" />
            }
            highlights={highlightContent.media}
          />
          {/* LGBTQI sites */}
          <HighlightSection
            title={<FormattedMessage id="Home.Highlights.LGBTQI" />}
            description={
              <FormattedMessage id="Home.Highlights.LGBTQI.Description" />
            }
            highlights={highlightContent.lgbtqi}
          />
          {/* Censorship changes */}
          <HighlightSection
            title={<FormattedMessage id="Home.Highlights.Changes" />}
            description={
              <FormattedMessage id="Home.Highlights.Changes.Description" />
            }
            highlights={highlightContent.changes}
          />
          <div className="my-4 text-xl">
            <FormattedMessage
              id="Home.Highlights.CTA"
              values={{
                'link-to-search': (string) => (
                  <Link href="/search">{string}</Link>
                ),
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

LandingPage.propTypes = {
  countryCount: PropTypes.number,
  asnCount: PropTypes.number,
  measurementCount: PropTypes.number,
}

export default LandingPage
