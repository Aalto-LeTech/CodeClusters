import React, { memo, useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiTrash, FiMaximize2 } from 'react-icons/fi'

import { Button } from '../elements/Button'
import { Input } from '../elements/Input'
import { Icon } from '../elements/Icon'

import { ReviewStore } from '../stores/ReviewStore'
import { ITheme } from '../types/theme'
import { ISubmissionWithDate, IReview } from 'shared'

interface IProps {
  className?: string
  reviewStore?: ReviewStore
}
interface IReviewFormParams {
  message: string
  metadata: string
}

const EMPTY_REVIEW_FORM_PARAMS: IReviewFormParams = {
  message: '',
  metadata: ''
}

const FloatingReviewMenuEl = inject('reviewStore')(observer((props: IProps) => {
  const { className, reviewStore } = props
  const [review, setReview] = useState(EMPTY_REVIEW_FORM_PARAMS)

  function handleClickMaximize() {

  }
  function handleUpdateReview(data: IReviewFormParams) {
    setReview(data)
  }
  function handleDeleteReview() {
    reviewStore!.setOpenSubmission()
  }
  async function handleSubmit(data: IReviewFormParams, onSuccess: () => void, onError: () => void) {
    const submission_id = reviewStore!.openSubmission!.id
    // const selection = reviewStore!.openSelection
    const payload = { ...data, submission_id }
    const result = await reviewStore!.addReview(payload)
    if (result) {
      onSuccess()
      reviewStore!.setOpenSubmission()
    } else {
      onError()
    }
  }
  return (
    <Wrapper className={className}>
      <Container>
        <Header>
          <Title>Submit review</Title>
          <Icon button onClick={handleClickMaximize}><FiMaximize2 size={18}/></Icon>
        </Header>
        <Body>
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

const Title = styled.h4`
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
  margin: 0 0 1rem 0;
  width: 100%;
`
const Body = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
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
        >Remove</Button>
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
