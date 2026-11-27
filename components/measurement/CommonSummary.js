import Link from 'next/link'
import PropTypes from 'prop-types'
import { useContext } from 'react'
import { MdOutlineFeedback, MdOutlineOpenInNew } from 'react-icons/md'
import {
  PiShieldBold,
  PiShieldCheckBold,
  PiShieldWarningBold,
} from 'react-icons/pi'
import { useIntl } from 'react-intl'
import { EmbeddedViewContext } from '../../pages/m/[measurement_uid]'
import ConditionalWrapper from '../ConditionalWrapper'
import Flag from '../Flag'

const ANON_CREDENTIALS_URL =
  'https://ooni.org/post/2025-announcing-ooni-new-anonymous-credential-system/'

const preliminaryStripeStyle = (backgroundColor) => ({
  backgroundColor,
  backgroundImage: `repeating-linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.4) 0,
    rgba(255, 255, 255, 0.4) 6px,
    transparent 6px,
    transparent 12px
  )`,
})

const verificationStatusConfig = {
  verified: {
    Icon: PiShieldCheckBold,
    iconClass: 'text-green-400',
    label: 'Measurement.CommonSummary.ProbeAuthenticated',
  },
  unverified: {
    Icon: PiShieldBold,
    iconClass: 'text-gray-400',
    label: 'Measurement.CommonSummary.ProbeUnauthenticated',
  },
  failed: {
    Icon: PiShieldWarningBold,
    iconClass: 'text-red-400',
    label: 'Measurement.CommonSummary.ProbeAuthenticationFailed',
  },
}

const VerificationStatusBadge = ({ status }) => {
  const intl = useIntl()
  const entry = verificationStatusConfig[status]
  if (!entry) return null
  const { Icon, iconClass, label } = entry
  return (
    <div className="inline-flex gap-1.5 items-end mt-3">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1.5">
        <Icon className={`text-base shrink-0 ${iconClass}`} />
        <span className="text-sm font-bold text-white">
          {intl.formatMessage({ id: label })}
        </span>
      </div>
      <a
        href={ANON_CREDENTIALS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-end gap-0.5 text-white/70 underline hover:text-white"
      >
        <span className="inline-block w-fit max-w-[16ch] text-balance text-xs leading-tight">
          {intl.formatMessage({
            id: 'Measurement.CommonSummary.ViaAnonymousCredentials',
          })}
          <MdOutlineOpenInNew
            className="inline mx-1 shrink-0 text-xs"
            aria-hidden
          />
        </span>
      </a>
    </div>
  )
}

const CommonSummary = ({
  color,
  measurement_start_time,
  probe_asn,
  probe_cc,
  networkName,
  country,
  hero,
  verification_status,
  onVerifyClick,
  isPreliminary = false,
}) => {
  const isEmbeddedView = useContext(EmbeddedViewContext)
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
      className="text-white"
      style={{ backgroundColor: color }}
      data-testid="common-summary"
    >
      <div className="container pb-8 pt-24">
        <div className="flex justify-between">
          <div className="text-base w-1/2">{formattedDate}</div>
          {!isEmbeddedView && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/40 px-3 py-1.5 text-white cursor-pointer hover:bg-black/10 transition-colors"
              onClick={onVerifyClick}
            >
              <MdOutlineFeedback className="text-base shrink-0" />
              <span className="text-sm font-bold">
                {intl.formatMessage({ id: 'Measurement.CommonSummary.Verify' })}
              </span>
            </button>
          )}
        </div>
        {hero}
        <div className="flex justify-between mt-2">
          <div className="lg:w-1/2">
            <ConditionalWrapper
              condition={!isEmbeddedView}
              wrapper={(children) => (
                <Link
                  className="text-white hover:text-white block underline"
                  href={`/country/${countryCode}`}
                >
                  {children}
                </Link>
              )}
            >
              <div className="flex items-center text-xl">
                <div className="mr-2">
                  <Flag countryCode={countryCode} size={33} />
                </div>
                {country}
              </div>
            </ConditionalWrapper>
            <ConditionalWrapper
              condition={!isEmbeddedView}
              wrapper={(children) => (
                <Link
                  className="text-white hover:text-white block underline"
                  href={`/as/${network}`}
                >
                  {children}
                </Link>
              )}
            >
              <div className="mt-2 text-base">
                {network} {networkName}
              </div>
            </ConditionalWrapper>
          </div>
          <VerificationStatusBadge status={verification_status} />
        </div>
      </div>
      {isPreliminary && (
        <div
          className="h-3 w-full"
          style={preliminaryStripeStyle(color)}
          aria-hidden
        />
      )}
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
  isPreliminary: PropTypes.bool,
}

export default CommonSummary
