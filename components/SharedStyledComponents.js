import styled from 'styled-components'
import { Button } from 'ooni-components'

export const StyledSticky = styled.div`
position: sticky;
top: 0;
background: white;
z-index: 100;
border-bottom: 1px solid ${props => props.theme.colors.gray3};
`

export const StyledStickyNavBar = styled.div`
position: sticky;
top: 0;
z-index: 100;
`

export const StyledStickySubMenu = styled.div`
position: sticky;
top: 66px;
background: white;
z-index: 100;
border-bottom: 1px solid ${props => props.theme.colors.gray3};
`

// port the design to ooni-components
export const StyledHollowButton = styled(Button)`
&:hover {
  border-color: ${props => props.theme.colors.blue9};
  color: ${props => props.theme.colors.blue9};
  &:hover:enabled {
    border-color: ${props => props.theme.colors.blue9};
  }
}
`
StyledHollowButton.defaultProps = {
  hollow: true
}