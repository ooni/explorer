import PropTypes from 'prop-types'
import { MdPhoneAndroid, MdWebAsset } from 'react-icons/md'
import { FormattedMessage, defineMessages } from 'react-intl'
import AccessPointStatus from '../AccessPointStatus'
import { DetailsBox } from '../DetailsBox'

const TelegramDetails = ({ measurement, render }) => {
  const testKeys = measurement.test_keys
  const {
    telegram_web_status,
    telegram_tcp_blocking,
    telegram_http_blocking,
    tcp_connect,
  } = testKeys

  const message = defineMessages({
    reachable: {
      id: 'Measurement.Metadata.Telegram.Reachable',
      defaultMessage: 'Telegram was reachable in {country}',
    },
    unReachable: {
      id: 'Measurement.Metadata.Telegram.UnReachable',
      defaultMessage: 'Telegram was NOT reachable in {country}',
    },
  })

  let telegramWebOK = true
  let telegramDesktopOK = true
  let anomaly = false
  let hint = (
    <FormattedMessage id="Measurement.Status.Hint.Telegram.Reachable" />
  )
  let summaryText = 'Measurement.Details.SummaryText.Telegram.Reachable'
  let headMetadata = message.reachable

  if (telegram_web_status === 'blocked') {
    telegramWebOK = false
    summaryText = 'Measurement.Details.SummaryText.Telegram.AppFailure'
    headMetadata = message.unReachable
  }

  if (telegram_tcp_blocking === true || telegram_http_blocking === true) {
    telegramDesktopOK = false
    summaryText = 'Measurement.Details.SummaryText.Telegram.DesktopFailure'
    headMetadata = message.unReachable
  }

  if (!telegramWebOK || !telegramDesktopOK) {
    anomaly = true
    hint = <FormattedMessage id="Measurement.Status.Hint.Telegram.Blocked" />
    summaryText =
      'Measurement.Details.SummaryText.Telegram.DesktopAndAppFailure'
    headMetadata = message.unReachable
  }

  return render({
    status: anomaly ? 'anomaly' : 'reachable',
    statusInfo: hint,
    summaryText: summaryText,
    headMetadata: {
      message: headMetadata,
      formatted: false,
    },
    details: (
      <>
        <div className="flex gap-8 mb-8">
          <AccessPointStatus
            icon={<MdPhoneAndroid />}
            label={
              <FormattedMessage id="Measurement.Details.Telegram.Endpoint.Label.Mobile" />
            }
            ok={telegramDesktopOK}
          />
          <AccessPointStatus
            icon={<MdWebAsset />}
            label={
              <FormattedMessage id="Measurement.Details.Telegram.Endpoint.Label.Web" />
            }
            ok={telegramWebOK}
          />
        </div>
        {Array.isArray(tcp_connect) && tcp_connect.length > 0 && (
          <DetailsBox
            title={
              <FormattedMessage id="Measurement.Details.Telegram.Endpoint.Status.Heading" />
            }
          >
            {tcp_connect.map((connection, index) => (
              <div className="flex" key={index}>
                <div>
                  {connection.status.failure && (
                    <FormattedMessage
                      id="Measurement.Details.Telegram.Endpoint.ConnectionTo.Failed"
                      values={{
                        destination: (
                          <strong>
                            {' '}
                            {connection.ip}:{connection.port}{' '}
                          </strong>
                        ),
                      }}
                    />
                  )}
                  {connection.status.success && (
                    <FormattedMessage
                      id="Measurement.Details.Telegram.Endpoint.ConnectionTo.Successful"
                      values={{
                        destination: (
                          <strong>
                            {' '}
                            {connection.ip}:{connection.port}{' '}
                          </strong>
                        ),
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </DetailsBox>
        )}
      </>
    ),
  })
}

TelegramDetails.propTypes = {
  measurement: PropTypes.object.isRequired,
  render: PropTypes.func,
}

export default TelegramDetails
