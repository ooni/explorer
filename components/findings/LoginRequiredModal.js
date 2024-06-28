import { useRouter } from 'next/router'
import { Button, Modal } from 'ooni-components'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import useUser from '../../hooks/useUser'

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
    logout()
    router.push('/login')
  }

  return (
    <StyledModal show={show} color="black" bg="white">
      {/* px={[1,3]} py={4} */}
      <div className="container mx-auto text-center">
        <div className="flex">
          <h4>
            {intl.formatMessage({ id: 'Findings.LoginRequiredModal.Title' })}
          </h4>
        </div>
        <Button m={3} onClick={handleClick}>
          {intl.formatMessage({ id: 'General.Login' })}
        </Button>
      </div>
    </StyledModal>
  )
}

export default LoginRequiredModal
