import { FindingBox } from 'components/landing/HighlightBox'
import Link from 'next/link'

interface Finding {
  id: string
}

type FindingsSectionProps = {
  title: string
  theme: string
  findings: Finding[]
}

const FindingsSection = ({
  title,
  theme,
  findings = [],
}: FindingsSectionProps) => {
  return (
    <section className="mb-12">
      <h3>{title}</h3>
      {findings.length ? (
        <>
          <div className="grid my-8 gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {findings.map((finding) => (
              <FindingBox key={finding.id} incident={finding} />
            ))}
          </div>
          <div className="flex my-4 justify-center">
            <Link href={`/findings?theme=${theme}`}>
              <button type="button" className="btn btn-primary-hollow">
                See more
              </button>
            </Link>
          </div>
        </>
      ) : (
        <div className="my-3">No findings available</div>
      )}
    </section>
  )
}

export default FindingsSection
