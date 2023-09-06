import { ImSpinner8 } from 'react-icons/im'
import { keyframes, styled } from 'styled-components'

const spin = keyframes`
to {
  transform: rotate(360deg);
}
`

const StyledSpinner = styled(ImSpinner8)`
  animation: ${spin} 1s linear infinite;
`

const ButtonSpinner = () => <StyledSpinner />

export default ButtonSpinner
