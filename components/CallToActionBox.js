import NLink from 'next/link'
import { Button } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

const CallToActionBox = ({ title, text }) => {
  return (
    <div className="flex my-8 bg-gray-400 flex-wrap">
      <div className="w-full mx-8 my-2">
        <h4>{title}</h4>
        <div className="text-xl">{text}</div>
      </div>
      <div className="flex items-center m-8 flex-col md:flex-row">
        <div className="mr-8 mb-4 md:mb-0">
          <NLink href="https://ooni.org/install">
            <Button>
              <FormattedMessage id="Country.Overview.NoData.Button.InstallProbe" />
            </Button>
          </NLink>
        </div>
      </div>
    </div>
  )
}

export default CallToActionBox
