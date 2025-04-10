import { FindingBoxSmall } from 'components/landing/HighlightBox'
import Link from 'next/link'
import { ChartSpinLoader } from './Chart'

interface Finding {
  id: string
}

type FindingsSectionProps = {
  title: string
  theme: string
  findings: Finding[]
  isLoading: boolean
}

const FindingsSection = ({
  title,
  theme,
  findings = [],
  isLoading = false,
}: FindingsSectionProps) => {
  return (
    <section className="mb-12">
      <h2>{title}</h2>
      {isLoading ? (
        <ChartSpinLoader />
      ) : (
        <>
          {findings.length ? (
            <>
              <div className="grid my-8 gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {findings.map((finding) => (
                  <FindingBoxSmall key={finding.id} incident={finding} />
                ))}
                {theme && (
                  <div className="flex items-center justify-center px-24 text-center">
                    <Link href={`/findings?theme=${theme}`}>
                      See all related censorship findings »
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="my-3">No findings available</div>
          )}
        </>
      )}
    </section>
  )
}

export default FindingsSection
