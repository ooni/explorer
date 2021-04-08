import React, { useEffect, useState } from 'react'
import { ResponsiveCalendar } from '@nivo/calendar'
import { Flex, Box, Select } from 'ooni-components'
import useSWR from 'swr'

// TODO adapt to axios
const fetcher = url => fetch(url).then(r => r.json())

const fromDate = '2019-06-01'
const toDate = '2020-05-31'
const URL = `https://api.ooni.io/api/v1/aggregation?probe_cc=BR&since=${fromDate}&until=${toDate}&axis_x=measurement_start_day`

export const Calendar = () => {
  const { data, error } = useSWR(URL, fetcher)
  const [dataX, setDataX ] = useState([])

  const transformData = () => {
    if (data) {
      setDataX(data.result.map(item => ({
        day: item.measurement_start_day,
        value: item.measurement_count
      })))
    }
  }

  useEffect(() => {
    transformData()
  }, [data])

  if (!data) {
    return (
      <div> Loading... </div>
    )
  }

  return (
    <div style={{ height: '500px'}}>
      <Select placeholder='Select country'>
        <option>BR</option>
      </Select>
      {dataX &&
        <ResponsiveCalendar
          data={dataX}
          from={fromDate}
          to={toDate}
          margin={{
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }}
          emptyColor="#eeeeee"
          colors={[ '#61cdbb', '#97e3d5', '#e8c1a0', '#f47560' ]}
          yearLegendPosition='before'
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'row',
              translateY: 36,
              itemCount: 4,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              itemDirection: 'right-to-left'
            }
          ]}
        />
      }
    </div>
  )
}
