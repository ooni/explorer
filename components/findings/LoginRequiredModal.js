import { useRouter } from 'next/router'
import { Modal } from 'ooni-components'
import { useIntl } from 'react-intl'
import useUser from '../../hooks/useUser'

const LoginRequiredModal = ({ show }) => {
  const intl = useIntl()
  const { logout } = useUser()
  const router = useRouter()

  const handleClick = () => {
    logout()
    router.push('/login')
  }

  return (
    <Modal className="rounded-lg shadow-md text-black bg-white " show={show}>
      <div className="container text-center p-1 md:p-4 py-8">
        <div className="flex">
          <h4>
            {intl.formatMessage({ id: 'Findings.LoginRequiredModal.Title' })}
          </h4>
        </div>
        <button
          type="button"
          className="btn btn-primary m-4"
          onClick={handleClick}
        >
          {intl.formatMessage({ id: 'General.Login' })}
        </button>
      </div>
    </Modal>
  )
}

export default LoginRequiredModal
