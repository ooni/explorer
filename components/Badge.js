import styled from 'styled-components'

// XXX replace what is inside of search/results-list.StyledResultTag
const Badge = styled.div`
  margin-top: -4px;
  border-radius: 30px;
  padding: 8px 24px;
  line-height: 1;
  font-size: 16px;
  background-color: ${props => props.$bg || props.theme.colors.gray8};
  color: ${props => props.$color || props.theme.colors.white};
`

export default Badge
