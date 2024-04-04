import { Box, Button, Container, Flex, Heading } from 'ooni-components'
import styled from 'styled-components'

export const StyledSticky = styled.div`
position: sticky;
top: 0;
background: white;
z-index: 99;
border-bottom: 1px solid ${props => props.theme.colors.gray3};
`

export const StyledStickyNavBar = styled.div`
position: sticky;
top: 0;
z-index: 100;
`

export const StyledStickySubMenu = styled(Box)`
position: sticky;
top: 65.5px;
background: white;
z-index: 99;
border-bottom: 1px solid ${props => props.theme.colors.gray3};
`

const StyledContainer = styled(Container)`
border-bottom: 1px solid ${props => props.theme.colors.gray3};
`
export const StickySubMenu = ({ title, children }) => {
  return (
    <StyledStickySubMenu mt={[0, 4]} mb={2}>
      <Flex justifyContent='space-between' alignItems='center' flexDirection={['column', 'column', 'row']}>
        <Heading h={1} mt={1} mb={0} fontSize={[4, 5]}>
          {title}
        </Heading>
        <Box>
          {children}
        </Box>
      </Flex>
    </StyledStickySubMenu>
  )
}

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