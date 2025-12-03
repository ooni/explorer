/* global process */
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { colors } from 'ooni-components'
import { FormattedMessage, useIntl } from 'react-intl'
import { twMerge } from 'tailwind-merge'
import FormattedMarkdown from '../components/FormattedMarkdown'
import HighlightSection from '../components/landing/HighlightsSection'
import CoverageChart from '../components/landing/Stats'
import highlightContent from '../components/landing/highlights.json'
import { toCompactNumberUnit } from '../utils'
import { DonationBanner } from 'components/DonationBanner'

interface StatsItemProps {
  label: React.ReactNode
  unit?: string
  value: number
}

const StatsItem = ({ label, unit, value }: StatsItemProps) => (
  <div className="text-center w-1/3 p-4 text-blue-900">
    <div className="text-4xl md:text-5xl font-light">
      {value}
      <span className="text-3xl">{unit}</span>
    </div>
    <div className="text-gray-700">{label}</div>
  </div>
)

const FeatureRow = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge(
      'flex flex-wrap items-center justify-center py-8',
      className,
    )}
    {...props}
  >
    {children}
  </div>
)

const FeatureBox = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge('w-full md:w-1/2 leading-normal text-xl', className)}
    {...props}
  >
    {children}
  </div>
)

const FeatureBoxTitle = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={twMerge('flex text-blue-900 text-2xl font-bold mb-2', className)}
    {...props}
  >
    {children}
  </div>
)

export async function getServerSideProps() {
  const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
  const result = await client.get('/api/_/global_overview')

  return {
    props: {
      measurementCount: result.data.measurement_count,
      asnCount: result.data.network_count,
      countryCount: result.data.country_count,
    },
  }
}

interface LandingPageProps {
  measurementCount: number
  asnCount: number
  countryCount: number
}

const LandingPage = ({
  measurementCount,
  asnCount,
  countryCount,
}: LandingPageProps) => {
  const intl = useIntl()
  const compactMeasurementCount = toCompactNumberUnit(measurementCount)
  const compactAsnCount = toCompactNumberUnit(asnCount)

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'General.OoniExplorer' })}</title>
      </Head>
      <DonationBanner />
      <div
        className="pt-4 pb-12"
        style={{
          background: `linear-gradient(319.33deg, ${colors.blue['900']} 39.35%, ${colors.blue['500']} 82.69%), ${colors.blue['500']}`,
        }}
      >
        <div className="container bg-no-repeat bg-center bg-[url('/static/images/world-dots.svg')] pt-16 md:pb-[120px] md:mb-[90px] md:mt-[110px] md:pt-0">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl text-white md:leading-normal leading-normal">
              <FormattedMessage id="Home.Banner.Title.UncoverEvidence" />
            </h1>
            <div className="text-lg md:text-2xl text-blue-100">
              <FormattedMessage id="Home.Banner.Subtitle.ExploreCensorshipEvents" />
            </div>
            <div className="inline-block">
              <Link href="/chart/mat">
                <button
                  className="btn btn-white-hollow hover:!text-white btn-xl mt-12 mx-auto"
                  type="button"
                >
                  <FormattedMessage id="Home.Banner.Button.Explore" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="flex flex-wrap rounded-2xl bg-white md:px-8 md:py-4 lg:mx-[25%] md:mt-[-118px] md:mb-12">
          <StatsItem
            label={<FormattedMessage id="Home.Banner.Stats.Measurements" />}
            unit={compactMeasurementCount.unit}
            value={compactMeasurementCount.value}
          />
          <StatsItem
            label={<FormattedMessage id="Home.Banner.Stats.Countries" />}
            value={countryCount}
          />
          <StatsItem
            label={<FormattedMessage id="Home.Banner.Stats.Networks" />}
            unit={compactAsnCount.unit}
            value={compactAsnCount.value}
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
        <FeatureRow className="flex-col-reverse md:flex-row">
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
        <div className="container mb-16">
          <div className="flex justify-center my-4">
            <h2 className="text-blue-700">
              <FormattedMessage id={'Home.MonthlyStats.Title'} />
            </h2>
          </div>
          <CoverageChart />
        </div>
        {/* Highlights */}
        <div className="container">
          <div className="flex flex-wrap justify-center my-4">
            <h2 className="text-blue-700">
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
                'link-to-search': (string: string) => (
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

export default LandingPage
