import React, { useEffect, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'
import useScrollLock from '../hooks/useScrollLock'

import { AddReviewForm } from '../components/AddReviewForm'
import { Modal } from '../elements/Modal'
import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'

import { IReview, IReviewCreateFormParams } from 'shared'
import { IFormRefMethods } from '../types/forms'
import { Stores } from '../stores'
import { IModal, EModal } from '../stores/ModalStore'

interface IProps {
  className?: string
  modal?: IModal
  updateReview?: (reviewId: number, review: Partial<IReview>) => Promise<any>
  closeModal?: (modal: EModal) => void
}

export const AcceptEditReviewModal = inject((stores: Stores) => ({
  modal: stores.modalStore.modals[EModal.ACCEPT_EDIT_REVIEW],
  updateReview: stores.reviewStore.updateReview,
  closeModal: stores.modalStore.closeModal,
}))
(observer((props: IProps) => {
  const { className, modal, updateReview, closeModal } = props
  const [editing, setEditing] = useState(false)
  const [review, setReview] = useState<IReview | undefined>()

  useEffect(() => {
    // setReview(modal!.params.review)
    reviewFormRef?.current?.reset(modal!.params.review)
  }, [modal!.params])

  function handleClose() {
    closeModal!(EModal.ACCEPT_EDIT_REVIEW)
    setEditing(false)
  }
  async function handleSubmit(data: any, onSuccess: () => void, onError: () => void) {
    const payload = { ...modal!.params?.review, ...data }
    const result = await updateReview!(payload.review_id, payload)
    if (result) {
      reviewFormRef?.current?.reset(payload)
      onSuccess()
    } else {
      onError()
    }
  }
  const ref = useRef(null)
  const reviewFormRef = useRef<IFormRefMethods<IReviewCreateFormParams>>(null)
  useClickOutside(ref, (e) => handleClose(), modal!.isOpen)
  useScrollLock(modal!.isOpen)
  return (
    <Modal className={className}
      isOpen={modal!.isOpen}
      body={
        <Body ref={ref}>
          <Header>
            <TitleWrapper><h2>Accept or edit review</h2></TitleWrapper>
            <Icon button onClick={handleClose}><FiX size={24}/></Icon>
          </Header>
          <Content>
            <AddReviewForm
              ref={reviewFormRef}
              onSubmit={handleSubmit}
              onCancel={() => undefined}
            />
            <Buttons>
              <Button intent="success">Accept</Button>
              <Button intent="danger">Delete</Button>
            </Buttons>
          </Content>
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
  height: 100%;
  justify-content: space-between;
  max-width: 1200px;
  padding: 20px;
  text-align: center;
  width: calc(100% - 20px - 2rem);
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.DEFAULT_WIDTH}) {
    max-width: 600px;
  }
`
const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
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
const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px - 2rem);
  width: 100%;
  & > *:first-child {
    margin-bottom: 1rem;
  }
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.DEFAULT_WIDTH}) {
    flex-direction: row;
    & > *:first-child {
      margin-right: 1rem;
    }
  }
`
const Title = styled.h3`
  margin: 0;
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
