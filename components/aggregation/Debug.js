import PropTypes from 'prop-types'
import { Children, useState } from 'react'

import { DetailsBox } from '../measurement/DetailsBox'
import { useDebugContext } from './DebugContext'
import { paramsToQuery, queryToParams } from './website/queryUtils'

const Bold = ({ children }) => (
  <span className="font-bold text-gray-800">
    Childre
    {Children.toArray(children)}
  </span>
)

Bold.propTypes = {
  children: PropTypes.any,
}

const getCircularReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }
    return value
  }
}

export const Debug = ({ query, children, ...rest }) => {
  const [_, updateNoOpState] = useState(0)
  const { apiResponse, ...ctx } = useDebugContext()
  const {
    query: queryCtx,
    others,
    tableReshapeTimeRef,
    chartsReshapeTimeRef,
    renderTimeRef,
  } = ctx
  let params = {}

  if (query || queryCtx) {
    params = queryToParams(query !== undefined ? query : queryCtx)
  }

  const { input, since, until, probe_cc, axis_x, axis_y } = params

  const tableReshapeTime =
    tableReshapeTimeRef.current.pre > -1
      ? Number(
          tableReshapeTimeRef.current.post - tableReshapeTimeRef.current.pre,
        ).toFixed(3)
      : undefined
  const chartReshapeTime =
    chartsReshapeTimeRef.current.pre > -1
      ? Number(
          chartsReshapeTimeRef.current.post - chartsReshapeTimeRef.current.pre,
        ).toFixed(3)
      : undefined
  const renderTime = Number(
    [...renderTimeRef.current].pop() - chartsReshapeTimeRef.current.post,
  ).toFixed(3)
  const apiQuery = `${process.env.NEXT_PUBLIC_OONI_API}/api/v1/aggregation?${paramsToQuery(params)}`

  return (
    <div className="flex text-gray-600" {...rest}>
      <DetailsBox
        collapsed={true}
        title="Debugging Information"
        content={
          <>
            <h4>
              Statistics{' '}
              {input && (
                <span>
                  for <Bold>{input}</Bold>
                </span>
              )}{' '}
              {probe_cc && (
                <span>
                  in <Bold>{probe_cc}</Bold>
                </span>
              )}{' '}
              from <Bold>{since}</Bold> until <Bold>{until}</Bold>
            </h4>
            <div className="flex flex-row">
              <div>
                {axis_x && (
                  <span>
                    X-axis: <Bold>{axis_x}</Bold>
                  </span>
                )}
              </div>
              <div className="ml-4">
                {axis_y && (
                  <span>
                    Y-axis: <Bold>{axis_y}</Bold>
                  </span>
                )}
              </div>
            </div>
            <div className="my-2">
              API Query:{' '}
              <Bold>
                <a href={apiQuery} target="_blank" rel="noreferrer">
                  {apiQuery}
                </a>
              </Bold>
            </div>
            <div>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => updateNoOpState(performance.now())}
              >
                refresh
              </button>

              <details>
                <summary>
                  {' '}
                  API Response ({apiResponse?.data?.result?.length} items)
                </summary>
                {apiResponse?.data?.result?.length > 1000 ? (
                  <pre>
                    That is a lot of data to show.{' '}
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={apiQuery}
                      title="API Query"
                    >
                      Click
                    </a>{' '}
                    to fetch this data in a new tab.
                  </pre>
                ) : (
                  <pre>
                    {JSON.stringify(
                      apiResponse?.data,
                      getCircularReplacer(),
                      2,
                    )}
                  </pre>
                )}
              </details>
            </div>
            <div>
              <div>Response Time: {apiResponse?.loadTime ?? '...'}ms</div>
              <div>
                Table Reshape Time: {tableReshapeTime ?? '...'}ms (
                {Number(tableReshapeTimeRef.current.post).toFixed(3)} -{' '}
                {Number(tableReshapeTimeRef.current.pre).toFixed(3)})
              </div>
              <div>
                Charts Reshape Time: {chartReshapeTime ?? '...'}ms (
                {Number(chartsReshapeTimeRef.current.post).toFixed(3)} -{' '}
                {Number(chartsReshapeTimeRef.current.pre).toFixed(3)})
              </div>
              <div>
                Render Time: {renderTime ?? '...'}ms (
                {Number([...renderTimeRef.current].pop()).toFixed(3)} -{' '}
                {Number(chartsReshapeTimeRef.current.post).toFixed(3)})
              </div>
            </div>
            <pre className="my-4">
              {JSON.stringify({ ...others, ...ctx }, null, 2)}
            </pre>
            <div>{children}</div>
          </>
        }
      />
    </div>
  )
}

Debug.propTypes = {
  children: PropTypes.any,
  query: PropTypes.object,
}
