import prettyMs from 'pretty-ms'
import PropTypes from 'prop-types'
import { MdOpenInNew } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'
import { getTestMetadata } from '../utils'

import { useContext } from 'react'
import { EmbeddedViewContext } from '../../pages/m/[measurement_uid]'
import TestGroupBadge from '../Badge'
import SocialButtons from '../SocialButtons'

const DetailsHeader = ({ testName, runtime, notice, url }) => {
  const metadata = getTestMetadata(testName)
  const isEmbeddedView = useContext(EmbeddedViewContext)

  return (
    <>
      {!isEmbeddedView && (
        <div className="flex my-4 justify-end">
          <SocialButtons url={url} />
        </div>
      )}
      <div className="flex mb-8 mt-4 gap-1 flex-col md:flex-row">
        <div className="flex items-center">
          <TestGroupBadge testName={testName} />
          <div className="ml-2">
            <a
              className="text-blue-700 md:text-xl flex items-center"
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
          <div className="md:text-xl">
            <FormattedMessage id="Measurement.DetailsHeader.Runtime" />:{' '}
            <span className="font-bold">{prettyMs(runtime * 1000)}</span>
          </div>
        )}
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
