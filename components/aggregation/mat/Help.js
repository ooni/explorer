import FormattedMarkdown from 'components/FormattedMarkdown'
import { DetailsBox } from 'components/measurement/DetailsBox'
import { getCategoryCodesMap } from 'components/utils/categoryCodes'
import { MdHelp } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'

const boxTitle = (
  <div className="flex items-center">
    <MdHelp size={22} />
    <div className="mx-1">
      <FormattedMessage id="MAT.Help.Box.Title" />
    </div>
  </div>
)

const Help = () => {
  const router = useRouter()
  const redirectToOutcomeChart = () => {
    router.push({
      pathname: '/chart/mat',
      query: { ...router.query, data: 'analysis' },
    })
  }

  const redirectToObservationsChart = () => {
    router.push({
      pathname: '/chart/mat',
      query: { ...router.query, data: 'observations' },
    })
  }

  return (
    <DetailsBox title={boxTitle}>
      <FormattedMarkdown id="MAT.Help.Content" />
      <div className="flex flex-col">
        {[...getCategoryCodesMap().values()].map(
          ({ code, name, description }, i) => (
            <div
              className={`flex py-2 px-2 border-b border-gray-200 w-full items-center bg-gray-50 ${Number(i) % 2 && 'bg-white'}`}
              key={code}
            >
              <div className="font-bold w-full md:w-1/3">
                <FormattedMessage id={name} />
              </div>
              <div className="w-full md:w-2/3">
                <FormattedMessage id={description} />
              </div>
            </div>
          ),
        )}
      </div>
      <button
        onClick={() => redirectToOutcomeChart()}
        type="button"
        className="block mt-4 mb-2 text-blue-500"
      >
        Pipeline v5 Analysis Chart
      </button>
      <button
        onClick={() => redirectToObservationsChart()}
        type="button"
        className="block text-blue-500"
      >
        Pipeline v5 Observations Chart
      </button>
    </DetailsBox>
  )
}

export default Help
