import { Modal, Container, Flex, Button, Heading } from 'ooni-components'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import useUser from '../../hooks/useUser'
import { useRouter } from 'next/router'

const StyledModal = styled(Modal)`
  border-radius: 8px;
  box-shadow: 4px 4px 10px black;
  svg {
    display: none;
  }
`

const LoginRequiredModal = ({ show }) => {
  const intl = useIntl()
  const { logout } = useUser()
  const router = useRouter()

  const handleClick = () => {
    router.push('/login').then(() => {
      logout()
    })
  }

  return (
    <StyledModal show={show} color='black' bg='white'>
      <Container px={[1,3]} py={4} textAlign='center'>
        <Flex>
          <Heading h={4}>
            {intl.formatMessage({ id: 'Incidents.LoginRequiredModal.Title' })}
          </Heading>
        </Flex>
        <Button m={3} onClick={handleClick}>
          {intl.formatMessage({ id: 'General.Login' })}
        </Button>
      </Container>
    </StyledModal>
  )
}

export default LoginRequiredModal