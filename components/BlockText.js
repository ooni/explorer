import { Box } from 'ooni-components'
import styled from 'styled-components'

const BlockText = styled(Box)`
  background-color: ${(props) => props.theme.colors.gray0};
  border-left: 10px solid ${(props) => props.theme.colors.blue5};
`

BlockText.defaultProps = {
  p: 3,
  fontSize: 1,
}

export default BlockText
