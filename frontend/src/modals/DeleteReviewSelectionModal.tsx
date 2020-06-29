import React, { useRef } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'
import useScrollLock from '../hooks/useScrollLock'

import { Modal } from '../elements/Modal'
import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'

import { Stores } from '../stores'
import { IModal, EModal } from '../stores/ModalStore'

interface IProps {
  className?: string
  modal?: IModal
  closeModal?: (modal: EModal) => void
}

export const DeleteReviewSelectionModal = inject((stores: Stores) => ({
  modal: stores.modalStore.modals[EModal.DELETE_REVIEW_SELECTION],
  closeModal: stores.modalStore.closeModal,
}))
(observer((props: IProps) => {
  const { className, modal, closeModal } = props
  function handleClose() {
    closeModal!(EModal.DELETE_REVIEW_SELECTION)
  }
  function onAccept() {
    modal!.params?.submit()
    handleClose()
  }
  function onCancel() {
    handleClose()
  }
  const ref = useRef(null)
  useClickOutside(ref, (e) => handleClose(), modal!.isOpen)
  useScrollLock(modal!.isOpen)
  return (
    <Modal className={className}
      isOpen={modal!.isOpen}
      body={
        <Body ref={ref}>
          <Header>
            <TitleWrapper><h2>This will delete {modal!.params.count} selections</h2></TitleWrapper>
            <Icon button onClick={handleClose}><FiX size={24}/></Icon>
          </Header>
          <Buttons>
            <Button intent="success" onClick={onAccept}>OK</Button>
            <Button intent="transparent" onClick={onCancel}>Cancel</Button>
          </Buttons>
        </Body>
      }
    ></Modal>
  )
}))

const Body = styled.div`
  align-items: center;
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 600px;
  padding: 20px;
  text-align: center;
  width: calc(100% - 20px);
  .close-icon {
    align-self: flex-end;
    position: relative;
    right: -5px; // Move the icon a little closer the border than the 20px padding allows to look nicer
    top: -5px;
  }
`
const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  width: 100%;
`
const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-left: 40px;
  width: 100%;
  & > h2 {
    font-size: 20px;
    font-weight: 500;
    margin: 0;
    padding: 0;
  }
`
const Buttons = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  & > *:first-child {
    margin-right: 1rem;
  }
`
