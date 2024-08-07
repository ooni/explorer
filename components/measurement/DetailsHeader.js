import prettyMs from 'pretty-ms'
import PropTypes from 'prop-types'
import { MdOpenInNew } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import { getTestMetadata } from '../utils'

import TestGroupBadge from '../Badge'
import SocialButtons from '../SocialButtons'

const DetailsHeader = ({ testName, runtime, notice, url }) => {
  const metadata = getTestMetadata(testName)

  return (
    <>
      <div className="flex pt-8 pb-2 items-end md:items-center flex-col md:flex-row">
        <div className="flex mb-4 md:mb-0 items-center">
          <TestGroupBadge testName={testName} />
          <div className="ml-2">
            <a
              className="text-blue-700 text-xl flex items-center"
              href={metadata.info}
            >
              {metadata.name}
              &nbsp;
              <small>
                <MdOpenInNew />
              </small>
            </a>
          </div>
        </div>
        <div className="mx-auto">{notice}</div>
        {runtime && (
          <div className="text-xl">
            <FormattedMessage id="Measurement.DetailsHeader.Runtime" />:{' '}
            <span className="font-bold">{prettyMs(runtime * 1000)}</span>
          </div>
        )}
      </div>
      <div className="flex pb-8 pt-2 items-start md:items-end">
        <SocialButtons url={url} />
      </div>
    </>
  )
}

DetailsHeader.propTypes = {
  testName: PropTypes.string.isRequired,
  runtime: PropTypes.number.isRequired,
  notice: PropTypes.any,
}

export default DetailsHeader
