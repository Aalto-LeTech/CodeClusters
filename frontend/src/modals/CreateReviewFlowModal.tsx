import React, { useRef } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'
import useScrollLock from '../hooks/useScrollLock'

import { AddReviewForm, IAddReviewFormParams } from '../components/AddReviewForm'
import { Modal } from '../elements/Modal'
import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'

import { IReviewCreateParams } from 'shared'
import { Stores } from '../stores'
import { IModal, EModal } from '../stores/ModalStore'

interface IProps {
  className?: string
  currentSelectionCount?: number
  modal?: IModal
  closeModal?: () => void
  addReview?: (message: string, metadata: string) => Promise<any>
  resetSelections?: () => void
}

export const CreateReviewFlowModal = inject((stores: Stores) => ({
  modal: stores.modalStore.modals[EModal.CREATE_REVIEW_FLOW],
  closeModal: () => stores.modalStore.closeModal(EModal.CREATE_REVIEW_FLOW),
  addReview: stores.reviewStore.addReview,
  resetSelections: stores.reviewStore.resetSelections,
}))
(observer((props: IProps) => {
  const { className, modal, closeModal, addReview, resetSelections } = props
  function handleClose() {
    closeModal!()
  }
  function onAccept() {
    modal!.params?.submit()
    closeModal!()
  }
  function onCancel() {
    closeModal!()
  }
  async function handleReviewSubmit(payload: IAddReviewFormParams, onSuccess: () => void, onError: () => void) {
    const result = await addReview!(payload.message, payload.metadata)
    if (result) {
      onSuccess()
      resetSelections!()
      closeModal!()
    } else {
      onError()
    }
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
            <TitleWrapper><h2>Create new review flow</h2></TitleWrapper>
            <Icon button onClick={handleClose}><FiX size={24}/></Icon>
          </Header>
          <SearchParams>
            <SearchTitle>Search</SearchTitle>
            <div><Button>Use current search</Button></div>
          </SearchParams>
          <SubmissionsVisualization>
            this should visualize the selected submissions as eg diff of submissions
          </SubmissionsVisualization>
          <AddReviewForm
            onSubmit={handleReviewSubmit}
            onCancel={handleClose}
          />
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
const SearchTitle = styled.h3``
const SearchParams = styled.div`
  align-items: center;
  display: flex;
`
const SubmissionsVisualization = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 2rem 0;
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
