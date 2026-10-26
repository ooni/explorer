import dynamic from 'next/dynamic'
import { useContext, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import type { Fetcher } from 'swr'
import { EmbeddedViewContext } from '../../pages/m/[measurement_uid]'
import { LazyDetailsBox } from './DetailsBox'

const LoadingRawData = () => {
  return <FormattedMessage id="General.Loading" />
}

const ReactJson = dynamic(() => import('@microlink/react-json-view'), {
  ssr: false,
  loading: LoadingRawData,
})

type RawMeasurementProps = {
  measurementUid: string
  fetcher: Fetcher<object, string>
}

const RawMeasurement = ({ measurementUid, fetcher }: RawMeasurementProps) => {
  const intl = useIntl()
  const isEmbeddedView = useContext(EmbeddedViewContext)
  const [collapsed, setCollapsed] = useState<number>(1)

  const rawMsmtUrl = `/api/ooni/v1/raw_measurement?measurement_uid=${encodeURIComponent(measurementUid)}`

  return (
    <LazyDetailsBox
      swrKey={rawMsmtUrl}
      fetcher={fetcher}
      title={
        <div className="flex flex-1 justify-between flex-col md:flex-row items-center bg-gray-200">
          <div>
            {intl.formatMessage({
              id: 'Measurement.CommonDetails.RawMeasurement.Heading',
            })}
          </div>
          {!isEmbeddedView && (
            <div className="flex">
              <a
                className="text-blue-700"
                href={rawMsmtUrl}
                download={`ooni-measurement-${measurementUid}.json`}
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
                  e.stopPropagation()
                  setCollapsed(50)
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
    >
      {(measurement) =>
        typeof measurement === 'object' ? (
          <div className="flex bg-white" style={{ direction: 'ltr' }}>
            <div className="text-xs md:text-sm [&_.string-value]:overflow-ellipsis [&_.string-value]:max-w-[800px] [&_.string-value]:overflow-hidden [&_.string-value]:inline-block">
              <ReactJson
                collapsed={collapsed}
                src={measurement}
                name={null}
                indentWidth={2}
              />
            </div>
          </div>
        ) : (
          <FormattedMessage id="Measurement.CommonDetails.RawMeasurement.Unavailable" />
        )
      }
    </LazyDetailsBox>
  )
}

export default RawMeasurement
