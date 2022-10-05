import { DetailsBox } from 'components/measurement/DetailsBox'
import { Flex, Box, Text, Heading } from 'ooni-components'
import { MdHelp } from 'react-icons/md'
import styled from 'styled-components'

import { getCategoryCodesMap } from 'components/utils/categoryCodes'
import FormattedMarkdown from 'components/FormattedMarkdown'
import { FormattedMessage } from 'react-intl'

const Row = styled(Flex)`
  padding: 8px 0px;
  /* odd/even stying - uses index prop given to Row from Array.map */
  ${props => Number(props.index) % 2 && 'background: inherit;'};
  border-bottom: 1px solid ${props => props.theme.colors.gray2};
`

const Name = styled(Box).attrs({
  fontWeight: 'bold'
})``

const boxTitle = (
  <Flex alignItems='center'>
    <MdHelp size={22} />
    <Text mx={1}><FormattedMessage id='MAT.Help.Box.Title' /></Text>
  </Flex>
)

const Help = () => {
  return (
    <DetailsBox title={boxTitle} collapsed={false}>
      <FormattedMarkdown id='MAT.Help.Content' />
      <Flex flexDirection='column'>
        {[...getCategoryCodesMap().values()].map(({ code, name, description }, i) => (
          <Row key={code} index={i} width={[1, 3/4]} alignItems='center' bg='gray0'>
             <Name width={[1, 1/3]}><FormattedMessage id={name} /></Name>
            <Box width={[1, 2/3]}><FormattedMessage id={description} /></Box>
          </Row>
        ))}
      </Flex>
    </DetailsBox>
  )
}

export default Help