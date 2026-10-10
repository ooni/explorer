import { FormattedMessage } from 'react-intl'

type AccessPointStatusProps = {
  icon?: React.ReactNode
  label: React.ReactNode
  ok?: boolean
  content?: React.ReactNode
  width?: number
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>

const AccessPointStatus = ({
  icon,
  label,
  ok,
  content,
  ...props
}: AccessPointStatusProps) => {
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
      <div className={`${!ok && 'text-yellow-1000'} text-2xl font-extralight`}>
        {content}
      </div>
    </div>
  )
}

export default AccessPointStatus
