import Link from 'next/link'
import { FormattedMessage } from 'react-intl'

const CallToActionBox = ({ title, text }) => {
  return (
    <div className="flex p-4 bg-gray-300 flex-wrap min-h-[180px]">
      <div className="mb-2">
        <h4>{title}</h4>
        <div className="text-xl">{text}</div>
      </div>
      <Link href="https://ooni.org/install">
        <button type="button" className="btn btn-primary">
          <FormattedMessage id="Country.Overview.NoData.Button.InstallProbe" />
        </button>
      </Link>
    </div>
  )
}

export default CallToActionBox
