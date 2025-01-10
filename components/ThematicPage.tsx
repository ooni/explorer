import { useRouter } from 'next/router'

import ChartIntersectionObserver from 'components/ChartIntersectionObserver'
import FindingsSection from 'components/FindingsSection'
import ReportsSection from 'components/ReportsSection'
import {
  StickySubMenuUpdated,
  StyledStickySubMenu,
} from 'components/SharedStyledComponents'
import { Form } from 'components/dashboard/Form'
import { MetaTags } from 'components/dashboard/MetaTags'
import { useEffect, useState } from 'react'

// type ThematicPageProps = {
//   countries: string[],
//   reports: string[],
// }

type AnchorLinkProps = {
  id: string
}

export const AnchorLink = ({ id }: AnchorLinkProps) => (
  <div id={id} className="h-[200px] mt-[-200px] md:h-[200px] md:mt-[-200px]" />
)

const AnchorLinkLower = ({ id }: AnchorLinkProps) => (
  <div id={id} className="h-[200px] mt-[-200px] md:h-[280px] md:mt-[-280px]" />
)

const ThematicPage = ({
  countries = [],
  reports = [],
  findings = [],
  selectedCountries = [],
  domains = [],
  apps = [],
  title = '',
  findingsTitle = '',
  reportsTitle = '',
  text = '',
  theme = '',
  menu = '',
}) => {
  const { query } = useRouter()
  const [filters, setFilters] = useState([])
  const [filteredDomains, setFilteredDomains] = useState(domains)
  const [filteredApps, setFilteredApps] = useState(apps)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (filters.length) {
      setFilteredDomains(domains.filter((d) => filters.includes(d)))
      setFilteredApps(apps.filter((a) => filters.includes(a)))
    } else {
      setFilteredDomains(domains)
      setFilteredApps(apps)
    }
  }, [filters])

  return (
    <>
      <MetaTags />
      <div className="container">
        <StickySubMenuUpdated
          topClass="top-[116px]"
          title={title}
          menu={menu}
        />
        <div className="my-8 bg-gray-50 p-4 text-sm">{text}</div>

        <AnchorLink id="findings" />
        <FindingsSection
          title={findingsTitle}
          findings={findings}
          theme={theme}
        />

        <AnchorLink id="reports" />
        <ReportsSection title={reportsTitle} reports={reports} theme={theme} />

        <StyledStickySubMenu className="top-[193px] max-sm:static">
          <div className="pb-4 pt-2">
            <Form
              countries={countries}
              selectedCountries={selectedCountries}
              domains={domains}
              apps={apps}
              setFilters={setFilters}
            />
          </div>
        </StyledStickySubMenu>
        {Object.keys(query).length > 0 && (
          <>
            {!!filteredApps.length && (
              <section>
                <AnchorLinkLower id="apps" />
                <h2>Apps</h2>
                {filteredApps?.map((testName: string) => (
                  <div key={testName} className="my-6">
                    <AnchorLinkLower id={testName} />
                    <ChartIntersectionObserver
                      testName={testName}
                      headerOptions={{ probe_cc: false }}
                    />
                  </div>
                ))}
              </section>
            )}
            {!!filteredDomains.length && (
              <section className="mt-10">
                <AnchorLinkLower id="websites" />
                <h2>Websites</h2>
                {filteredDomains?.map((domain: string) => (
                  <div key={domain} className="my-6">
                    <AnchorLinkLower id={domain} />
                    <ChartIntersectionObserver
                      domain={domain}
                      testName="web_connectivity"
                      headerOptions={{ probe_cc: false, test_name: false }}
                    />
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default ThematicPage
