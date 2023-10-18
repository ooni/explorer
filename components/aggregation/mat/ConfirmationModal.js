import { Modal, Container, Flex, Box, Button, Heading, Text } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

const StyledModal = styled(Modal)`
  border-radius: 8px;
  box-shadow: 4px 4px 10px black;
`

export const ConfirmationModal = ({ show, onConfirm, onCancel }) => {
  return (
    <StyledModal show={show} color='black' bg='white'>
      <Container p={3}>
        <Flex flexDirection='column'>
          <Heading h={4} textAlign='center'>
            <FormattedMessage id='MAT.Form.ConfirmationModal.Title' />
          </Heading>
          <Box my={2} px={5}>
            <Text>
              <FormattedMessage id='MAT.Form.ConfirmationModal.Message' />
            </Text>
          </Box>
        </Flex>
      </Container>
      <Flex justifyContent='flex-end' my={3}>
        <Button mx={3} width={1/3} inverted onClick={onCancel}>
          <Text fontWeight='bold'><FormattedMessage id='MAT.Form.ConfirmationModal.No' /></Text>
        </Button>
        <Button mx={3} width={1/3} onClick={onConfirm}>
          <Text fontWeight='bold'><FormattedMessage id='MAT.Form.ConfirmationModal.Button.Yes' /></Text>
        </Button>
      </Flex>
    </StyledModal>
  )
}