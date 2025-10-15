import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useContext, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { EmbeddedViewContext } from '../../pages/m/[measurement_uid]'
import { DetailsBox, DetailsBoxTable } from './DetailsBox'

const LoadingRawData = () => {
  return <FormattedMessage id="General.Loading" />
}

const ReactJson = dynamic(() => import('@microlink/react-json-view'), {
  ssr: false,
  loading: LoadingRawData,
})

const JsonViewer = ({ src, collapsed }) => (
  <div className="text-xs md:text-sm [&_.string-value]:overflow-ellipsis [&_.string-value]:max-w-[800px] [&_.string-value]:overflow-hidden [&_.string-value]:inline-block">
    <ReactJson collapsed={collapsed} src={src} name={null} indentWidth={2} />
  </div>
)

JsonViewer.propTypes = {
  src: PropTypes.object.isRequired,
}

const CommonDetails = ({
  measurement,
  reportId,
  measurementUid,
  userFeedbackItems = [],
}) => {
  const {
    software_name,
    software_version,
    annotations,
    resolver_asn,
    resolver_ip,
    resolver_network_name,
  } = measurement ?? {}

  const isEmbeddedView = useContext(EmbeddedViewContext)

  const { query } = useRouter()
  const queryString = new URLSearchParams(query)
  const rawMsmtDownloadURL = `${process.env.NEXT_PUBLIC_OONI_API}/api/v1/raw_measurement?${queryString}`
  const [collapsed, setCollapsed] = useState(1)

  const intl = useIntl()
  const unavailable = intl.formatMessage({
    id: 'Measurement.CommonDetails.Value.Unavailable',
  })

  let engine = unavailable
  let platform = unavailable

  if (annotations?.engine_name) {
    engine = annotations.engine_name

    if (annotations.engine_version) {
      engine = `${engine} (${annotations.engine_version})`
    }
  }

  if (annotations?.platform) {
    platform = annotations.platform
  }

  let software = software_name ?? unavailable
  software += software_version ? ` (${software_version})` : ''

  const downloadFilename = `ooni-measurement-${measurementUid}.json`
  const items = [
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.MsmtID',
      }),
      value: measurementUid ?? unavailable,
    },
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.ReportID',
      }),
      value: reportId ?? unavailable,
    },
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.Platform',
      }),
      value: platform,
    },
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.Software',
      }),
      value: software,
    },
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.Engine',
      }),
      value: engine,
    },
  ]

  const showResolverItems = resolver_asn || resolver_ip || resolver_network_name
  const resolverItems = [
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.ResolverASN',
      }),
      value: resolver_asn ?? unavailable,
    },
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.ResolverIP',
      }),
      value: resolver_ip ?? unavailable,
    },
    {
      label: intl.formatMessage({
        id: 'Measurement.CommonDetails.Label.ResolverNetworkName',
      }),
      value: resolver_network_name ?? unavailable,
    },
  ]

  const expandAllBtn = (e) => {
    e.stopPropagation()
    setCollapsed(50)
  }

  return (
    <>
      {showResolverItems && (
        // Resolver data
        <DetailsBoxTable
          title={
            <FormattedMessage id="Measurement.CommonDetails.Label.Resolver" />
          }
          items={resolverItems}
        />
      )}
      {/* Metadata: platform, probe, MK version etc. */}
      <DetailsBoxTable items={items} className="bg-gray-200" />
      {/* User Feedback */}
      {!!userFeedbackItems.length && (
        <DetailsBoxTable
          title={
            <FormattedMessage id="Measurement.CommonDetails.Label.UserFeedback" />
          }
          items={userFeedbackItems}
        />
      )}
      {/* Raw Measurement */}
      <DetailsBox
        title={
          <div className="flex flex-1 justify-between flex-col md:flex-row items-center bg-gray-200">
            <div className="self-start">
              {intl.formatMessage({
                id: 'Measurement.CommonDetails.RawMeasurement.Heading',
              })}
            </div>
            {!isEmbeddedView && (
              <div className="flex">
                <a
                  className="text-blue-700"
                  href={rawMsmtDownloadURL}
                  download={downloadFilename}
                >
                  <button
                    type="button"
                    className="btn btn-primary px-8 mx-4 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {intl.formatMessage({
                      id: 'Measurement.CommonDetails.RawMeasurement.Download',
                    })}
                  </button>
                </a>
                <button
                  type="button"
                  className="btn btn-primary px-8 mx-4 text-sm"
                  onClick={(e) => {
                    expandAllBtn(e)
                  }}
                >
                  {intl.formatMessage({
                    id: 'Measurement.CommonDetails.RawMeasurement.Expand',
                  })}
                </button>
              </div>
            )}
          </div>
        }
        content={
          measurement && typeof measurement === 'object' ? (
            <div className="flex bg-white" style={{ direction: 'ltr' }}>
              <JsonViewer src={measurement} collapsed={collapsed} />
            </div>
          ) : (
            <FormattedMessage id="Measurement.CommonDetails.RawMeasurement.Unavailable" />
          )
        }
      />
    </>
  )
}

CommonDetails.propTypes = {
  measurement: PropTypes.object,
  reportId: PropTypes.string,
  measurementUid: PropTypes.string,
}

export default CommonDetails
