import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

const AccessPointStatus = ({ icon, label, ok, content, color, ...props }) => {
  if (content === undefined) {
    if (ok === true) {
      content = <FormattedMessage id="General.OK" />
    } else if (ok === false) {
      content = <FormattedMessage id="General.Failed" />
    } else {
      content = (
        <FormattedMessage id="Measurement.Details.Endpoint.Status.Unknown" />
      )
    }
  }

  return (
    <div {...props}>
      {icon}
      <div className="font-bold text-xs">{label}</div>
      <div
        className={`${!ok && 'text-yellow-1000'} text-2xl font-extralight`}
        color={color}
      >
        {content}
      </div>
    </div>
  )
}

AccessPointStatus.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  ok: PropTypes.oneOf([true, false, undefined]),
  content: PropTypes.any,
}

export default AccessPointStatus
