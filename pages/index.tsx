/* global process */
import axios from 'axios'
import Link from 'next/link'
import { colors } from 'ooni-components'
import { FormattedMessage, useIntl } from 'react-intl'
import { twMerge } from 'tailwind-merge'
import FindingsSection from 'components/FindingsSection'
import FormattedMarkdown from 'components/FormattedMarkdown'
import CoverageChart from 'components/landing/Stats'
import { convertDatesData, sortData } from 'hooks/useFindings'
import { getFindings } from 'lib/api'
import { toCompactNumberUnit } from 'utils'

const FINDINGS_THEMES = [
  'social_media',
  'news_media',
  'human_rights',
  'circumvention',
] as const

type FindingTheme = (typeof FINDINGS_THEMES)[number]

type FindingSummary = {
  id: string
  title: string
  author: string
  start_time: string
  end_time?: string
  short_description: string
  CCs: string[]
}

const toFindingSummary = (finding: {
  id: string
  title: string
  reported_by?: string
  start_time: Date | string
  end_time?: Date | string
  short_description: string
  CCs: string[]
}): FindingSummary => ({
  id: finding.id,
  title: finding.title,
  author: finding.reported_by ?? '',
  start_time:
    finding.start_time instanceof Date
      ? finding.start_time.toISOString()
      : finding.start_time,
  ...(finding.end_time && {
    end_time:
      finding.end_time instanceof Date
        ? finding.end_time.toISOString()
        : finding.end_time,
  }),
  short_description: finding.short_description,
  CCs: finding.CCs ?? [finding.CCs?.[0]],
})

const groupFindingsByTheme = (
  incidents: { id: string; themes?: string[] }[],
): Record<FindingTheme, FindingSummary[]> => {
  const sorted = sortData(convertDatesData(incidents))

  return FINDINGS_THEMES.reduce(
    (acc, theme) => {
      acc[theme] = sorted
        .filter((f: { themes?: string[] }) => f.themes?.includes(theme))
        .slice(0, 5)
        .map(toFindingSummary)
      return acc
    },
    {} as Record<FindingTheme, FindingSummary[]>,
  )
}
interface StatsItemProps {
  label: React.ReactNode
  unit?: string
  value: number
}

const StatsItem = ({ label, unit, value }: StatsItemProps) => (
  <div className="text-center w-1/3 p-4 text-blue-900">
    <div className="text-4xl md:text-5xl font-light">
      <span data-testid="stats-value">{value}</span>
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

export async function getStaticProps() {
  const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_OONI_API })
  const [result, incidents] = await Promise.all([
    client.get('/api/_/global_overview'),
    getFindings().catch(() => []),
  ])

  return {
    props: {
      measurementCount: result.data.measurement_count,
      asnCount: result.data.network_count,
      countryCount: result.data.country_count,
      findings: groupFindingsByTheme(incidents),
    },
    revalidate: 60 * 60 * 1, // 1 hours
  }
}

interface LandingPageProps {
  measurementCount: number
  asnCount: number
  countryCount: number
  findings: Record<FindingTheme, FindingSummary[]>
}

const LandingPage = ({
  measurementCount,
  asnCount,
  countryCount,
  findings,
}: LandingPageProps) => {
  const intl = useIntl()
  const compactMeasurementCount = toCompactNumberUnit(measurementCount)
  const compactAsnCount = toCompactNumberUnit(asnCount)

  return (
    <>
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
              <Link
                href="/chart/mat"
                className="btn btn-white-hollow hover:text-white! btn-xl mt-12 mx-auto"
              >
                <FormattedMessage id="Home.Banner.Button.Explore" />
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

          <FindingsSection
            title={intl.formatMessage({
              id: 'ThematicPage.SocialMedia.FindingsTitle',
            })}
            theme="social_media"
            findings={findings.social_media}
          />
          <FindingsSection
            title={intl.formatMessage({
              id: 'ThematicPage.NewsMedia.FindingsTitle',
            })}
            theme="news_media"
            findings={findings.news_media}
          />
          <FindingsSection
            title="Findings on blocking Human Rights Websites"
            theme="human_rights"
            findings={findings.human_rights}
          />
          <FindingsSection
            title={intl.formatMessage({
              id: 'ThematicPage.Circumvention.FindingsTitle',
            })}
            theme="circumvention"
            findings={findings.circumvention}
          />
          <div className="my-4 text-xl">
            <FormattedMessage
              id="Home.Highlights.CTA"
              values={{
                'link-to-search': (string: React.ReactNode) => (
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
