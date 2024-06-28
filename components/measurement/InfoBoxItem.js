import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

export const InfoBoxItem = ({ label, content, unit }) => (
  <div>
    <div className="text-2xl">
      {content} {unit && <small>{unit}</small>}
    </div>
    <div className="font-bold text-base">{label}</div>
  </div>
)

InfoBoxItem.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(FormattedMessage),
  ]),
  content: PropTypes.any,
  unit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(FormattedMessage),
  ]),
}
