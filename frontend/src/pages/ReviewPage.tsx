import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { Button } from '../elements/Button'
import { Input } from '../elements/Input'

import { ReviewStore } from '../stores/ReviewStore'
import { IReview, IReviewCreateParams } from 'common'

interface IProps {
  reviewStore: ReviewStore,
}

export const ReviewPage = inject('reviewStore')(observer((props: IProps) => {
  const { reviewStore } = props
  function handleSubmit(data: IReviewCreateParams) {
    return reviewStore.addReview(data)
  }
  return (
    <Container>
      <header>
        <h1>Review</h1>
      </header>
      <ReviewForm onSubmit={handleSubmit}/>
    </Container>
  )
}))

interface IFormProps {
  className?: string
  onSubmit: (data: IReviewCreateParams) => Promise<IReview | undefined>
}

const ReviewForm = styled((props: IFormProps) => {
  const { className } = props
  const [submission_id, setSubmissionId] = useState(1)
  const [message, setMessage] = useState('')
  const [metadata, setMetadata] = useState('')
  const [submitInProgress, setSubmitInProgress] = useState(false)

  function hasNoError() {
    return true
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hasNoError()) {
      const payload = {
        submission_id,
        message,
        metadata,
      }
      setSubmitInProgress(true)
      const result = await props.onSubmit(payload)
      if (result) {
        setSubmitInProgress(false)
        setMessage('')
        setMetadata('')
      } else {
        setSubmitInProgress(false)
      }
    }
  }
  return (
    <Form onSubmit={handleSubmit} className={className}>
      <FormField>
        <label>Submission id</label>
        <Input
          type="number"
          value={submission_id}
          onChange={(val: number) => setSubmissionId(val)}
          fullWidth
        ></Input>
      </FormField>
      <FormField>
        <label>Message</label>
        <Input
          type="textarea"
          value={message}
          onChange={(val: string) => setMessage(val)}
          fullWidth
        ></Input>
      </FormField>
      <FormField>
        <label>Metadata</label>
        <Input
          type="textarea"
          value={metadata}
          onChange={(val: string) => setMetadata(val)}
          fullWidth
        ></Input>
      </FormField>
      <Button
        type="submit"
        intent="success"
        disabled={!hasNoError() || submitInProgress}
        loading={submitInProgress}
      >Submit</Button>
    </Form>
  )
})``


const Container = styled.div`
`
const Form = styled.form`
  & > * {
    margin-top: 1rem;
  }
`
const FormField = styled.div`
  display: flex;
  flex-direction: column;
`
