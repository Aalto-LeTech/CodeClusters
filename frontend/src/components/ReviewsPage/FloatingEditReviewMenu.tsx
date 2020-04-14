import React, { memo, useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'
import { FiTrash, FiX } from 'react-icons/fi'

import { Icon } from '../../elements/Icon'
import { Button } from '../../elements/Button'
import { AddReviewForm, IAddReviewFormParams } from '../AddReviewForm'

import { IReview } from 'shared'
import { Stores } from '../../stores'
import { EModal } from '../../stores/ModalStore'

interface IProps {
  className?: string
  review: IReview
  closeMenu: () => void
  updateReview?: (review: Partial<IReview>) => Promise<boolean>
  openDeleteReviewSelectionModal?: (params: any) => void
}

const FloatingEditReviewMenuEl = inject((stores: Stores) => ({
  updateReview: stores.reviewStore.updateReview,
  openDeleteReviewSelectionModal: (params: any) => stores.modalStore.openModal(EModal.DELETE_REVIEW_SELECTION, params),
}))
(observer((props: IProps) => {
  const { className, review, updateReview, openDeleteReviewSelectionModal, closeMenu } = props
  /**
   * Stop the menu from being closed by ResultItem as the click event otherwise will propagate to it
   * and its click event handler which will call toggleSelection.
   * @param e 
   */
  function handleStopPropagation(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
  }
  function handleClickClose() {
    closeMenu()
  }
  function handleDeleteReview() {
  }
  async function handleSubmit(data: any, onSuccess: () => void, onError: () => void) {
    const result = await updateReview!(data)
    if (result) {
      onSuccess()
    } else {
      onError()
    }
  }
  return (
      <Container className={className} onClick={handleStopPropagation}>
        <Header>
          <Title>Accept review</Title>
          <Icon button onClick={handleClickClose}><FiX size={18}/></Icon>
        </Header>
        <Body>
          <Buttons>
            <Button intent="success">Accept</Button>
            <Button intent="danger">Delete</Button>
          </Buttons>
          <Header>
            <Title>Edit review</Title>
          </Header>
          <AddReviewForm
            initialData={review}
            onSubmit={handleSubmit}
            onCancel={closeMenu}
          />
        </Body>
      </Container>
  )
}))

const Title = styled.h3`
  margin: 0;
`
const Wrapper = styled.div`
  position: relative;
`
const Container = styled.div`
  align-items: center;
  background: #fff;
  border: 2px solid #222;
  border-radius: 4px;
  box-shadow: 2px 2px 1px silver;
  color: #222;
  cursor: default;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  left: -210px;
  position: absolute;
  top: 42px;
  width: 288px;
  z-index: 2;
`
const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  width: 100%;
`
const Buttons = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  & > *:first-child {
    margin-right: 1rem;
  }
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const FloatingEditReviewMenu = styled(FloatingEditReviewMenuEl)``
