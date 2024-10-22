import ChartWrapper from 'components/ChartWrapper'
import Form from 'components/domain/Form'
import FindingsSection from 'components/FindingsSection'
import ReportsSection from 'components/ReportsSection'
import {
  StickySubMenuUpdated,
  StyledStickySubMenu,
} from 'components/SharedStyledComponents'
import { getCountries, getReports } from 'lib/api'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

export const getServerSideProps = async () => {
  try {
    const reports = await getReports('theme-human_rights')
    const countries = await getCountries()

    return {
      props: {
        reports,
        countries,
      },
    }
  } catch (error) {
    return {
      props: {
        error: JSON.stringify(error?.message),
      },
    }
  }
}

const HUMAN_RIGHTS_DOMAINS = [
  'www.amnesty.org',
  'www.hrw.org',
  'freedomhouse.org',
  'www.omct.org',
  'www.awid.org',
  'www.fidh.org',
]

const HumanRights = ({ countries, reports }) => {
  const intl = useIntl()
  const router = useRouter()
  const { query } = router

  // Sync page URL params with changes from form values
  const onSubmit = (data) => {
    const params = {}
    for (const p of Object.keys(data)) {
      if (data[p]) {
        params[p] = data[p]
      }
    }
    // since: "2022-01-02",
    // until: "2022-02-01",

    const { since, until, probe_cc } = params

    if (
      query.since !== since ||
      query.until !== until ||
      query.probe_cc !== probe_cc
    ) {
      router.push({ query: params }, undefined, { shallow: true })
    }
  }

  return (
    <div className="container">
      <StickySubMenuUpdated
        topClass="top-[116px]"
        title={intl.formatMessage({ id: 'Navbar.HumanRights' })}
        menu={
          <>
            <a href="#findings">Findings</a>
            <a href="#reports">Reports</a>
            <a href="#websites">Websites</a>
          </>
        }
      />
      <FindingsSection
        title="Findings on blocking Human Rights websites"
        theme="human_rights"
      />
      <ReportsSection
        title="Reports on blocking Human Rights websites"
        reports={reports}
      />
      <StyledStickySubMenu topClass="top-[193px]">
        <div className="pb-4 pt-2">
          <Form
            onSubmit={onSubmit}
            availableCountries={countries.map((c) => c.alpha_2)}
          />
        </div>
      </StyledStickySubMenu>
      {HUMAN_RIGHTS_DOMAINS.map((domain) => (
        <div key={domain} className="my-6">
          <ChartWrapper domain={domain} testName="web_connectivity" />
        </div>
      ))}
    </div>
  )
}

export default HumanRights
