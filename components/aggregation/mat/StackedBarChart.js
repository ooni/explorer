import React from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'ooni-components'
import styled from 'styled-components'
import { useIntl } from 'react-intl'

import GridChart, { prepareDataForGridChart } from './GridChart'
import { NoCharts } from './NoCharts'

const ChartContainer = styled(Flex)`
  position: relative;
  // border: 2px solid ${props => props.theme.colors.gray1};
  // padding: 16px;
`

export const StackedBarChart = ({ data, query }) => {
  const intl = useIntl()

  try { 
    const [gridData, rows ] = prepareDataForGridChart(data, query, intl.locale)

    return (
      <ChartContainer flexDirection={['column']}>
        <GridChart
          data={gridData}
          rowKeys={rows}
          rowLabels={[undefined]}
          height={500}
          noLabels={true}
        />
      </ChartContainer>
    )
  } catch (e) {
    return (<NoCharts message={e.message}/>)
  }
}

StackedBarChart.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.shape({
      dimension_count: PropTypes.number,
      result: PropTypes.array,
    }),
    loadTime: PropTypes.number,
    url: PropTypes.string
  }),
  query: PropTypes.object
}
