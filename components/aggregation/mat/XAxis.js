import { ResponsiveBar } from '@nivo/bar'
import { Box, Flex } from 'ooni-components'
import styled from 'styled-components'
import { useMATContext } from './MATContext'

import { getXAxisTicks } from './timeScaleXAxis'
import { useIntl } from 'react-intl'
import { getDirection } from '../../withIntl'

const StyledFlex = styled(Flex)`
  direction: ltr;
`

export const XAxis = ({ data }) => {
  const { locale } = useIntl()
  const [ query ] = useMATContext()
  const xAxisTickValues = getXAxisTicks(query, 30)
  const xAxisMargins = {right: 50, left: 0, top: 60, bottom: 0}
  const axisTop = {
    enable: true,
    tickSize: 5,
    tickPadding: 5,
    tickRotation: getDirection(locale) === 'ltr' ? -45 : 315,
    tickValues: xAxisTickValues
  }

  return (
    <StyledFlex>
      <Box width={2/16}>
      </Box>
      <Box className='xAxis' sx={{ width: '100%', height: '62px' }}>
        <ResponsiveBar
          data={data}
          indexBy={query.axis_x}
          margin={xAxisMargins}
          padding={0.3}
          indexScale={{
            type: 'band',
            round: false
          }}
          layers={['axes']}
          axisTop={axisTop}
          axisBottom={null}
          axisLeft={null}
          axisRight={null}
          animate={false}
        />
      </Box>
    </StyledFlex>
  )
}
