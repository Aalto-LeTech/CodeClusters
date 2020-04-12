import React, { memo, useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiTrash, FiMaximize2 } from 'react-icons/fi'

import { Button } from '../elements/Button'
import { Input } from '../elements/Input'
import { Icon } from '../elements/Icon'
import { CheckBox } from '../elements/CheckBox'

import { Stores } from '../stores'
import { ReviewStore } from '../stores/ReviewStore'
import { EModal } from '../stores/ModalStore'

interface IProps {
  className?: string
  reviewStore?: ReviewStore
  openDeleteReviewSelectionModal?: (params: any) => void
}
interface IReviewFormParams {
  message: string
  metadata: string
}

const EMPTY_REVIEW_FORM_PARAMS: IReviewFormParams = {
  message: '',
  metadata: ''
}

const FloatingReviewMenuEl = inject((stores: Stores) => ({
  reviewStore: stores.reviewStore,
  openDeleteReviewSelectionModal: (params: any) => stores.modalStore.openModal(EModal.DELETE_REVIEW_SELECTION, params),
}))
(observer((props: IProps) => {
  const { className, reviewStore, openDeleteReviewSelectionModal } = props
  const [review, setReview] = useState(EMPTY_REVIEW_FORM_PARAMS)

  /**
   * Stop the menu from being closed by ResultItem as the click event otherwise will propagate to it
   * and its click event handler which will call toggleSelection.
   * @param e 
   */
  function handleStopPropagation(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
  }
  function handleClickMaximize() {

  }
  function handleMultiSelectionToggle() {
    if (reviewStore!.hasManySelections && reviewStore!.isMultiSelection) {
      openDeleteReviewSelectionModal!({
        submit: () => reviewStore!.toggleMultiSelection(),
        count: reviewStore!.currentSelectionCount - 1
      })
    } else {
      reviewStore!.toggleMultiSelection()
    }
  }
  function handleUpdateReview(data: IReviewFormParams) {
    setReview(data)
  }
  function handleDeleteReview() {
    reviewStore!.resetSelections()
  }
  async function handleSubmit(data: IReviewFormParams, onSuccess: () => void, onError: () => void) {
    const result = await reviewStore!.addReview(data.message, data.metadata)
    if (result) {
      onSuccess()
      reviewStore!.resetSelections()
    } else {
      onError()
    }
  }
  return (
    <Wrapper className={className} onClick={handleStopPropagation}>
      <Container>
        <Header>
          <Title>Submit review</Title>
          <Icon button onClick={handleClickMaximize}><FiMaximize2 size={18}/></Icon>
        </Header>
        <Body>
          <CheckBoxField>
            <CheckBox
              name="use_multiselect"
              type="toggle"
              checked={reviewStore!.isMultiSelection}
              onChange={handleMultiSelectionToggle}
            />
            <CheckBoxText title="Select multiple selections">Use multiselect</CheckBoxText>
          </CheckBoxField>
          <ReviewForm
            data={review}
            onUpdateReview={handleUpdateReview}
            onDelete={handleDeleteReview}
            onSubmit={handleSubmit}/>
        </Body>
      </Container>
    </Wrapper>
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

interface IFormProps {
  className?: string
  data: IReviewFormParams
  onUpdateReview: (data: IReviewFormParams) => void
  onSubmit: (data: IReviewFormParams, onSuccess: () => void, onError: () => void) => void
  onDelete: () => void
}

const ReviewForm = styled((props: IFormProps) => {
  const { className, data, onUpdateReview, onDelete, onSubmit } = props
  const [message, setMessage] = useState('')
  const [metadata, setMetadata] = useState('')
  const [submitInProgress, setSubmitInProgress] = useState(false)

  useEffect(() => {
    setMessage(data.message)
    setMetadata(data.metadata)
  }, [data])

  function hasNoError() {
    return true
  }
  function handleMessageChange(val: string) {
    setMessage(val)
    onUpdateReview({ message: val, metadata })
  }
  function handleMetadataChange(val: string) {
    setMetadata(val)
    onUpdateReview({ message, metadata: val })
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hasNoError()) {
      const payload = {
        message,
        metadata,
      }
      setSubmitInProgress(true)
      onSubmit(payload, onSuccess, onError)
    }
  }
  function onSuccess() {
    setSubmitInProgress(false)
    setMessage('')
    setMetadata('')
  }
  function onError() {
    setSubmitInProgress(false)
  }
  return (
    <Form onSubmit={handleSubmit} className={className}>
      <FormField>
        <label>Message</label>
        <Input
          type="textarea"
          value={message}
          onChange={handleMessageChange}
          fullWidth
        ></Input>
      </FormField>
      <FormField>
        <label>Metadata</label>
        <Input
          type="textarea"
          value={metadata}
          onChange={handleMetadataChange}
          fullWidth
        ></Input>
      </FormField>
      <Buttons>
        <Button
          type="submit"
          intent="success"
          disabled={!hasNoError() || submitInProgress}
          loading={submitInProgress}
        >Submit</Button>
        <Button
          intent="danger"
          onClick={onDelete}
        >Cancel</Button>
      </Buttons>
    </Form>
  )
})``

const Form = styled.form`
  width: 100%;
  & > *:not(:first-child) {
    margin-top: 1rem;
  }
`
const FormField = styled.div`
  display: flex;
  flex-direction: column;
`
const Buttons = styled.div`
  display: flex;
  & > *:first-child {
    margin-right: 1rem;
  }
`

export const FloatingReviewMenu = styled(FloatingReviewMenuEl)``
