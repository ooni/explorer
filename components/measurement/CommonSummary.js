import Link from 'next/link'
import PropTypes from 'prop-types'
import { MdOutlineFactCheck } from 'react-icons/md'
import { useIntl } from 'react-intl'
import Flag from '../Flag'

const CommonSummary = ({
  color,
  measurement_start_time,
  probe_asn,
  probe_cc,
  networkName,
  country,
  hero,
  onVerifyClick,
}) => {
  const intl = useIntl()
  const startTime = measurement_start_time
  const network = probe_asn
  const countryCode = probe_cc
  const formattedDate = new Intl.DateTimeFormat(intl.locale, {
    dateStyle: 'long',
    timeStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(startTime))

  return (
    <div
      className="pb-8 pt-24 text-white"
      style={{ backgroundColor: color }}
      data-test-id="common-summary"
    >
      <div className="container">
        <div className="flex justify-between">
          <div className="text-base">{formattedDate}</div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={onVerifyClick}
          >
            <div className="text-lg text-center">
              <MdOutlineFactCheck />
            </div>
            <div className="text-xs font-bold text-center">
              {intl
                .formatMessage({ id: 'Measurement.CommonSummary.Verify' })
                .toUpperCase()}
            </div>
          </div>
        </div>
        {hero}
        <div className="flex mt-2 underline">
          <div className="lg:w-1/2">
            <Link
              className="text-white hover:text-white block"
              href={`/country/${countryCode}`}
            >
              <div className="flex items-center text-xl">
                <div className="mr-2">
                  <Flag countryCode={countryCode} size={33} />
                </div>
                {country}
              </div>
            </Link>
            <Link
              className="text-base my-2 text-white hover:text-white block"
              href={`/as/${network}`}
            >
              {network} {networkName}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

CommonSummary.propTypes = {
  measurement_start_time: PropTypes.string.isRequired,
  probe_asn: PropTypes.string.isRequired,
  probe_cc: PropTypes.string.isRequired,
  networkName: PropTypes.string,
  country: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
}

export default CommonSummary
