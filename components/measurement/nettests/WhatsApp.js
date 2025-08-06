import PropTypes from 'prop-types'
import { MdPersonAdd, MdPhoneAndroid, MdWebAsset } from 'react-icons/md'
import { FormattedMessage, defineMessages } from 'react-intl'
import AccessPointStatus from '../AccessPointStatus'
import { DetailsBox } from '../DetailsBox'
import { formatTwoTuple } from 'utils'

const WhatsAppDetails = ({ isAnomaly, scores, measurement, render }) => {
  const testKeys = measurement.test_keys
  const tcp_connect = testKeys.tcp_connect
  let registrationServerAccessible
  let webAccessible
  let endpointsAccessible

  try {
    registrationServerAccessible =
      scores.analysis.registration_server_accessible
    endpointsAccessible = scores.analysis.whatsapp_endpoints_accessible
    webAccessible = scores.analysis.whatsapp_web_accessible
  } catch (e) {
    registrationServerAccessible = testKeys.registration_server_status === 'ok'
    endpointsAccessible = testKeys.whatsapp_endpoints_status === 'ok'
    webAccessible = testKeys.whatsapp_web_status === 'ok'
  }

  const messages = defineMessages({
    reachable: {
      id: 'Measurement.Metadata.Whatsapp.Reachable',
      defaultMessage: 'WhatsApp was reachable in {country}',
    },
    unReachable: {
      id: 'Measurement.Metadata.Whatsapp.UnReachable',
      defaultMessage: 'WhatsApp was likely blocked in {country}',
    },
  })

  let status = 'reachable'
  let info = (
    <FormattedMessage id="Measurement.Details.Hint.WhatsApp.Reachable" />
  )
  let summaryText = 'Measurement.Details.SummaryText.WhatsApp.Reachable'

  if (isAnomaly) {
    status = 'anomaly'
    info = <FormattedMessage id="Measurement.Status.Hint.WhatsApp.Blocked" />
    if (!endpointsAccessible) {
      summaryText = 'Measurement.Details.SummaryText.WhatsApp.AppFailure'
    } else if (!webAccessible) {
      summaryText = 'Measurement.Details.SummaryText.WhatsApp.DesktopFailure'
    } else if (!endpointsAccessible && !webAccessible) {
      summaryText =
        'Measurement.Details.SummaryText.WhatsApp.DesktopAndAppFailure'
    }
  }

  return render({
    status: status,
    statusInfo: info,
    summaryText: summaryText,
    headMetadata: {
      message: isAnomaly ? messages.unReachable : messages.reachable,
      formatted: false,
    },
    details: (
      <>
        <div className="mb-8 flex gap-8 md:gap-12">
          <AccessPointStatus
            icon={<MdPhoneAndroid />}
            label={
              <FormattedMessage id="Measurement.Details.WhatsApp.Endpoint.Label.Mobile" />
            }
            ok={endpointsAccessible}
          />

          <AccessPointStatus
            icon={<MdWebAsset />}
            label={
              <FormattedMessage id="Measurement.Details.WhatsApp.Endpoint.Label.Web" />
            }
            ok={webAccessible}
          />
          <AccessPointStatus
            icon={<MdPersonAdd />}
            label={
              <FormattedMessage id="Measurement.Details.WhatsApp.Endpoint.Label.Registration" />
            }
            ok={registrationServerAccessible}
          />
        </div>
        {Array.isArray(tcp_connect) && tcp_connect.length > 0 && (
          <>
            <DetailsBox
              title={
                <FormattedMessage id="Measurement.Details.WhatsApp.Endpoint.Status.Heading" />
              }
              content={
                <>
                  {tcp_connect.map((connection, index) => (
                    <div className="flex" key={index}>
                      <div>
                        {connection.status.failure && (
                          <FormattedMessage
                            id="Measurement.Details.WhatsApp.Endpoint.ConnectionTo.Failed"
                            values={{
                              destination: (
                                <strong>
                                  {' '}
                                  {formatTwoTuple(connection.ip, connection.port)}{' '}
                                </strong>
                              ),
                            }}
                          />
                        )}
                        {connection.status.success && (
                          <FormattedMessage
                            id="Measurement.Details.WhatsApp.Endpoint.ConnectionTo.Successful"
                            values={{
                              destination: (
                                <strong>
                                  {' '}
                                  {formatTwoTuple(connection.ip, connection.port)}{' '}
                                </strong>
                              ),
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </>
              }
            />
          </>
        )}
      </>
    ),
  })
}

WhatsAppDetails.propTypes = {
  measurement: PropTypes.object.isRequired,
  render: PropTypes.func,
}

export default WhatsAppDetails
