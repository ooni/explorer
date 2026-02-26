import { FormattedMessage } from 'react-intl'

export const NoCharts = ({ message }) => {
  return (
    <div className="flex flex-col justify-center h-[100%]">
      <div className="text-xl font-bold mb-2">
        <FormattedMessage id="MAT.Charts.NoData.Title" />
      </div>
      <div className="p-8 text-center bg-gray-200 font-bold">
        <div className="mb-2">
          <FormattedMessage id="MAT.Charts.NoData.Description" />
        </div>
        {message && (
          <div className="p-2 m-2 text-sm">
            <FormattedMessage id="MAT.Charts.NoData.Details" />
            <pre className="my-2">{message}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
