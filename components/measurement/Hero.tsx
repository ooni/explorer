// @ts-ignore
import { Cross, Tick } from 'ooni-components/icons'
import { FaQuestion } from 'react-icons/fa'
import { MdPriorityHigh, MdWarning } from 'react-icons/md'
import { useIntl } from 'react-intl'

interface HeroProps {
  status: string
  icon: React.ReactNode
  label: string
  info: React.ReactNode
}

const Hero = ({ status, icon, label, info }: HeroProps) => {
  const intl = useIntl()
  let computedLabel = ''

  if (status) {
    switch (status) {
      case 'anomaly':
        computedLabel = intl.formatMessage({ id: 'General.Anomaly' })
        icon = <MdPriorityHigh />
        break
      case 'reachable':
        computedLabel = intl.formatMessage({ id: 'General.OK' })
        icon = <Tick />
        break
      case 'error':
        computedLabel = intl.formatMessage({ id: 'General.Error' })
        icon = <FaQuestion size={36} />
        break
      case 'confirmed':
        computedLabel = intl.formatMessage({
          id: 'Measurement.Hero.Status.Confirmed',
        })
        icon = <Cross />
        break
      case 'down':
        computedLabel = intl.formatMessage({
          id: 'Measurement.Hero.Status.Down',
        })
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

export default Hero
