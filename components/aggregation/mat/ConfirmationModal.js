import { Modal } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

export const ConfirmationModal = ({ show, onConfirm, onCancel }) => {
  return (
    <Modal
      className="rounded-lg shadow-md shadow-black bg-white text-black"
      show={show}
    >
      <div className="container">
        <div className="flex flex-col">
          <h4 className="text-center">
            <FormattedMessage id="MAT.Form.ConfirmationModal.Title" />
          </h4>
          <div className="my-2 px-16">
            <FormattedMessage id="MAT.Form.ConfirmationModal.Message" />
          </div>
        </div>
      </div>
      <div className="flex justify-center my-4">
        <button
          type="button"
          className="btn btn-primary mx-4 w-1/3"
          onClick={onCancel}
        >
          <FormattedMessage id="MAT.Form.ConfirmationModal.No" />
        </button>
        <button
          type="button"
          className="btn btn-primary mx-4 w-1/3"
          onClick={onConfirm}
        >
          <FormattedMessage id="MAT.Form.ConfirmationModal.Button.Yes" />
        </button>
      </div>
    </Modal>
  )
}
