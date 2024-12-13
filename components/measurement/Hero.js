import { Cross, Tick } from 'ooni-components/icons'
import PropTypes from 'prop-types'
import { FaQuestion } from 'react-icons/fa'
import { MdPriorityHigh, MdWarning } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'

const Hero = ({ status, icon, label, info }) => {
  let computedLabel = ''
  if (status) {
    switch (status) {
      case 'anomaly':
        computedLabel = <FormattedMessage id="General.Anomaly" />
        icon = <MdPriorityHigh />
        break
      case 'reachable':
        computedLabel = <FormattedMessage id="General.OK" />
        icon = <Tick />
        break
      case 'error':
        computedLabel = <FormattedMessage id="General.Error" />
        icon = <FaQuestion size={36} />
        break
      case 'confirmed':
        computedLabel = (
          <FormattedMessage id="Measurement.Hero.Status.Confirmed" />
        )
        icon = <Cross />
        break
      case 'down':
        computedLabel = <FormattedMessage id="Measurement.Hero.Status.Down" />
        icon = <MdWarning />
        break
      default:
        icon = icon || <div />
    }
  }

  if (!label) {
    label = computedLabel
  }

  return (
    <div className="text-white my-8">
      <div className="font-normal text-2xl">
        <div className="flex my-2 justify-center items-center">
          {icon} <div>{label}</div>
        </div>
      </div>
      {info && <div className="text-3xl font-light text-center">{info}</div>}
    </div>
  )
}

Hero.propTypes = {
  status: PropTypes.string,
  icon: PropTypes.node,
  label: PropTypes.string,
  info: PropTypes.node,
}
export default Hero
