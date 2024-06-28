import { Button } from 'ooni-components'
import styled from 'styled-components'

export const StyledSticky = styled.div`
position: sticky;
top: 0;
background: white;
z-index: 99;
border-bottom: 1px solid ${(props) => props.theme.colors.gray3};
`

export const StyledStickyNavBar = ({ ...props }) => (
  <div className="sticky top-0 z-[100]" {...props} />
)

export const StyledStickySubMenu = ({ ...props }) => (
  <div
    className="sticky top-[65.5px] bg-white z-[99] border-b border-gray-400 md:mt-8 mb-2 pb-2 md:pb-0"
    {...props}
  />
)
// border-bottom: 1px solid ${props => props.theme.colors.gray3};

export const StickySubMenu = ({ title, children }) => {
  return (
    <StyledStickySubMenu>
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row">
        <h1 className="mt-1 mb-0 text-4xl md:text-5xl">{title}</h1>
        {children}
      </div>
    </StyledStickySubMenu>
  )
}

// port the design to ooni-components
export const StyledHollowButton = styled(Button)`
&:hover {
  border-color: ${(props) => props.theme.colors.blue9};
  color: ${(props) => props.theme.colors.blue9};
  &:hover:enabled {
    border-color: ${(props) => props.theme.colors.blue9};
  }
}
`
