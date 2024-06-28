import { Button, Modal } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

const StyledModal = styled(Modal)`
  border-radius: 8px;
  box-shadow: 4px 4px 10px black;
`

export const ConfirmationModal = ({ show, onConfirm, onCancel }) => {
  return (
    <StyledModal show={show} color="black" bg="white">
      <div className="container mx-auto p-4">
        <div className="flex flex-col">
          <h4 className="text-center">
            <FormattedMessage id="MAT.Form.ConfirmationModal.Title" />
          </h4>
          <div className="my-2 px-16">
            <FormattedMessage id="MAT.Form.ConfirmationModal.Message" />
          </div>
        </div>
      </div>
      <div className="flex justify-end my-4">
        <Button mx={3} width={1 / 3} inverted onClick={onCancel}>
          <div className="font-bold">
            <FormattedMessage id="MAT.Form.ConfirmationModal.No" />
          </div>
        </Button>
        <Button mx={3} width={1 / 3} onClick={onConfirm}>
          <div className="font-bold">
            <FormattedMessage id="MAT.Form.ConfirmationModal.Button.Yes" />
          </div>
        </Button>
      </div>
    </StyledModal>
  )
}
