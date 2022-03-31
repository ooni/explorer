import { DetailsBox } from 'components/measurement/DetailsBox'
import { Flex, Box, Text, Heading } from 'ooni-components'
import { MdHelp } from 'react-icons/md'
import styled from 'styled-components'

import { categoryCodes } from 'components/utils/categoryCodes'
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
    <DetailsBox title={boxTitle} collapsed={true}>
      <Heading h={2}>
        <FormattedMessage id='MAT.Help.Title' />
      </Heading>
      <FormattedMarkdown id='MAT.Help.Content' />
      <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Gravida in fermentum et sollicitudin. Elementum sagittis vitae et leo duis ut. Convallis tellus id interdum velit. Eget dolor morbi non arcu. Tristique nulla aliquet enim tortor. Magnis dis parturient montes nascetur ridiculus mus. Mattis aliquam faucibus purus in massa tempor. Egestas quis ipsum suspendisse ultrices gravida. Ut tellus elementum sagittis vitae et leo. Interdum velit laoreet id donec ultrices. Arcu non sodales neque sodales ut etiam sit amet. Volutpat ac tincidunt vitae semper. Cras fermentum odio eu feugiat. Quis eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis. Tristique nulla aliquet enim tortor at. Tempor orci eu lobortis elementum nibh tellus. Netus et malesuada fames ac turpis egestas sed tempus urna. Luctus accumsan tortor posuere ac ut consequat. Tempor commodo ullamcorper a lacus.</Text>
      <Text>In tellus integer feugiat scelerisque. Curabitur vitae nunc sed velit dignissim. Sit amet porttitor eget dolor morbi non arcu. Ligula ullamcorper malesuada proin libero nunc. Nisl pretium fusce id velit. Eu non diam phasellus vestibulum lorem sed risus ultricies. Tortor aliquam nulla facilisi cras fermentum odio eu. Tellus in hac habitasse platea dictumst. Scelerisque mauris pellentesque pulvinar pellentesque habitant. Sed sed risus pretium quam vulputate dignissim suspendisse in. Libero justo laoreet sit amet cursus sit. Vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Donec pretium vulputate sapien nec sagittis aliquam. Aliquet nibh praesent tristique magna sit. Vel facilisis volutpat est velit egestas.</Text>

      <Heading h={2}>
        <FormattedMessage id='MAT.Help.Subtitle.Categories' />
      </Heading>
      <Flex flexDirection='column'>
        {categoryCodes.map(([code, name, description], i) => (
          <Row key={code} index={i} width={[1, 3/4]} alignItems='center' bg='gray0'>
            <Name width={[1, 1/3]}>{name}</Name>
            <Box width={[1, 2/3]}>{description}</Box>
          </Row>
        ))}
      </Flex>

      <Text><a rel="noreferrer" target='_blank' href='https://github.com/citizenlab/test-lists'>https://github.com/citizenlab/test-lists</a> </Text>
    </DetailsBox>
  )
}

export default Help