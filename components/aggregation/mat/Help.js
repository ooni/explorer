import FormattedMarkdown from 'components/FormattedMarkdown'
import { DetailsBox } from 'components/measurement/DetailsBox'
import { getCategoryCodesMap } from 'components/utils/categoryCodes'
import { MdHelp } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'

const boxTitle = (
  <div className="flex items-center">
    <MdHelp size={22} />
    <div className="mx-1">
      <FormattedMessage id="MAT.Help.Box.Title" />
    </div>
  </div>
)

const Help = () => {
  return (
    <DetailsBox title={boxTitle} collapsed={false}>
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
    </DetailsBox>
  )
}

export default Help
