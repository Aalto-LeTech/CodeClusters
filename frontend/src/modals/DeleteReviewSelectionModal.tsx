import React, { useRef } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'
import useScrollLock from '../hooks/useScrollLock'

import { Modal } from '../elements/Modal'
import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'

import { ModalStore } from '../stores/ModalStore'

interface IProps {
  className?: string
  modalStore?: ModalStore
}

const NAME = 'deleteReviewSelection'

export const DeleteReviewSelectionModal = inject('modalStore')(observer((props: IProps) => {
  const { className, modalStore } = props
  function handleClose() {
    modalStore!.closeModal(NAME)
  }
  function onAccept() {
    modalStore!.deleteReviewSelectionModal.params.submit()
    modalStore!.closeModal(NAME)
  }
  function onCancel() {
    modalStore!.closeModal(NAME)
  }
  const ref = useRef(null)
  useClickOutside(ref, (e) => handleClose(), modalStore!.deleteReviewSelectionModal.isOpen)
  useScrollLock(modalStore!.deleteReviewSelectionModal.isOpen)
  return (
    <Modal className={className}
      isOpen={modalStore!.deleteReviewSelectionModal.isOpen}
      body={
        <Body ref={ref}>
          <Header>
            <TitleWrapper><h2>This will delete {modalStore!.deleteReviewSelectionModal.params.count} selections</h2></TitleWrapper>
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
