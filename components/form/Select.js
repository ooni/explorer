// this is a workaround to be able to style rebass Select for RTL languages

import styled from 'styled-components'
import { Select as DSSelect } from 'ooni-components'
import { useIntl } from 'react-intl'
import { getDirection } from 'components/withIntl'
import { useMemo } from 'react'

const StyledSelect = styled.div`
${props => props.direction === 'rtl' ? `
svg { 
  margin-inline-start: -28px;
  margin-left: 0;
}
` : ''}
`

const Select = (props) => {
  const { locale } = useIntl()
  const direction = useMemo(() => (getDirection(locale)), [locale])

  return (
    <StyledSelect direction={direction}>
      <DSSelect {...props} style={{width: '100%'}}>
        {props.children}
      </DSSelect>
    </StyledSelect>
  )
}

export default Select