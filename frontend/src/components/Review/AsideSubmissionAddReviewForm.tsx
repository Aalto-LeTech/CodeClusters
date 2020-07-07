import React, { useRef } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { AddReviewForm } from './AddReviewForm'
import { CheckBox } from '../../elements/CheckBox'

import { IReviewCreateFormParams } from 'shared'
import { IFormRefMethods } from '../../types/forms'
import { Stores } from '../../stores'
import { EModal } from '../../stores/ModalStore'

interface IProps {
  className?: string
  hasManySelections?: boolean
  isMultiSelection?: boolean
  currentSelectionCount?: number
  addReview?: (payload: IReviewCreateFormParams) => Promise<any>
  toggleMultiSelection?: () => void
  resetSelections?: () => void
  openModal?: (modal: EModal, params: any) => void
}

const AsideSubmissionAddReviewFormEl = inject((stores: Stores) => ({
  hasManySelections: stores.reviewStore.hasManySelections,
  isMultiSelection: stores.reviewStore.isMultiSelection,
  currentSelectionCount: stores.reviewStore.currentSelectionCount,
  addReview: stores.reviewStore.addReview,
  toggleMultiSelection: stores.reviewStore.toggleMultiSelection,
  resetSelections: stores.reviewStore.resetSelections,
  openModal: stores.modalStore.openModal,
}))
(observer((props: IProps) => {
  const {
    className, hasManySelections, isMultiSelection, currentSelectionCount,
    addReview, toggleMultiSelection, resetSelections, openModal
  } = props
  const reviewFormRef = useRef<IFormRefMethods<IReviewCreateFormParams>>(null)

  /**
   * Stop the menu from being closed by ResultItem as the click event otherwise will propagate to it
   * and its click event handler which will call toggleSelection.
   * @param e 
   */
  function handleStopPropagation(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
  }
  function handleMultiSelectionToggle() {
    if (hasManySelections && isMultiSelection) {
      openModal!(EModal.DELETE_REVIEW_SELECTION, {
        submit: () => toggleMultiSelection!(),
        count: currentSelectionCount! - 1
      })
    } else {
      toggleMultiSelection!()
    }
  }
  function handleDeleteReview() {
    resetSelections!()
  }
  async function handleSubmit(data: IReviewCreateFormParams, onSuccess: () => void, onError: () => void) {
    const result = await addReview!(data)
    if (result) {
      reviewFormRef?.current?.reset(data)
      resetSelections!()
      onSuccess()
    } else {
      onError()
    }
  }
  return (
    <Wrapper className={className} onClick={handleStopPropagation}>
      <Container>
        <Header>
          <Title>Add review to {currentSelectionCount} submissions</Title>
        </Header>
        <Body>
          <CheckBoxField>
            <CheckBox
              name="use_multiselect"
              type="toggle"
              checked={isMultiSelection}
              onChange={handleMultiSelectionToggle}
            />
            <CheckBoxText title="Select multiple selections">Use multiselect</CheckBoxText>
          </CheckBoxField>
          <AddReviewForm
            ref={reviewFormRef}
            id="aside-submission-menu"
            onSubmit={handleSubmit}
            onCancel={handleDeleteReview}
          />
        </Body>
      </Container>
    </Wrapper>
  )
}))

const Title = styled.h4`
  margin: 0;
  white-space: break-spaces;
`
const Wrapper = styled.div`
  position: relative;
`
const Container = styled.div`
  align-items: center;
  background: #fff;
  border: 2px solid #222;
  border-radius: 4px;
  color: #222;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
`
const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  width: 100%;
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const CheckBoxField = styled.div`
  display: flex;
  margin: 0 0 1rem 0;
`
const CheckBoxText = styled.label`
  align-items: center;
  display: flex;
  margin-left: 1rem;
  padding: 3px 0;
`

export const AsideSubmissionAddReviewForm = styled(AsideSubmissionAddReviewFormEl)``
