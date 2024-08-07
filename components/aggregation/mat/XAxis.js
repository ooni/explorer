import { ResponsiveBar } from '@nivo/bar'
import { useMATContext } from './MATContext'

import { useIntl } from 'react-intl'
import { getDirection } from '../../withIntl'
import { getXAxisTicks } from './timeScaleXAxis'

export const XAxis = ({ data }) => {
  const { locale } = useIntl()
  const [query] = useMATContext()
  const xAxisTickValues = getXAxisTicks(query, 30)
  const xAxisMargins = { right: 50, left: 0, top: 60, bottom: 0 }
  const axisTop = {
    enable: true,
    tickSize: 5,
    tickPadding: 5,
    tickRotation: getDirection(locale) === 'ltr' ? -45 : 315,
    tickValues: xAxisTickValues,
  }

  return (
    <div className="flex" style={{ direction: 'ltr' }}>
      <div className="w-[12.5%]" />
      <div className="xAxis w-full h-[62px]">
        <ResponsiveBar
          data={data}
          indexBy={query.axis_x}
          margin={xAxisMargins}
          padding={0.3}
          indexScale={{
            type: 'band',
            round: false,
          }}
          layers={['axes']}
          axisTop={axisTop}
          axisBottom={null}
          axisLeft={null}
          axisRight={null}
          animate={false}
        />
      </div>
    </div>
  )
}
