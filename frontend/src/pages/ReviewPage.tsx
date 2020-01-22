import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { MdKeyboardArrowRight, MdKeyboardArrowUp } from 'react-icons/md'

import { SelectSubmissionList } from '../components/SelectSubmissionList'
import { Button } from '../elements/Button'
import { Input } from '../elements/Input'
import { Icon } from '../elements/Icon'

import { ReviewStore } from '../stores/ReviewStore'
import { ISubmissionWithDate, IReview } from 'common'

interface IProps {
  reviewStore: ReviewStore,
}
interface IReviewFormParams {
  message: string
  metadata: string
}

const EMPTY_REVIEW_FORM_PARAMS = {
  message: '',
  metadata: ''
} as IReviewFormParams

export const ReviewPage = inject('reviewStore')(observer((props: IProps) => {
  const { reviewStore } = props
  const [submissionId, setSubmissionId] = useState(0)
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0)
  const [reviews, setReviews] = useState([EMPTY_REVIEW_FORM_PARAMS] as IReviewFormParams[])

  function handleUpdateReview(data: IReviewFormParams) {
    setReviews(reviews.map((r, i) => i === currentReviewIdx ? data : r))
  }
  function handleAddReview() {
    setReviews([...reviews, EMPTY_REVIEW_FORM_PARAMS])
  }
  function handleDeleteReview() {
    if (reviews.length === 1) {
      setReviews([EMPTY_REVIEW_FORM_PARAMS] as IReviewFormParams[])
      return
    }
    const deleted = reviews.filter((r, i) => i !== currentReviewIdx)
    if (currentReviewIdx === deleted.length) {
      setCurrentReviewIdx(currentReviewIdx - 1)
    }
    // Reviews has to be set after currentReviewIdx to not pass undefined value by accident
    // if the current reviews was last of the list -> reviews[currentReviewIdx]
    setReviews(deleted)
  }
  function handleSelectSubmission(submission: ISubmissionWithDate) {
    setSubmissionId(submission.id)
  }
  function handleSubmit(data: IReviewFormParams) {
    const payload = { ...data, submission_id: submissionId }
    return reviewStore.addReview(payload)
  }
  return (
    <Container>
      <header>
        <h1>Review</h1>
      </header>
      <Body>
        <Header><Icon><MdKeyboardArrowRight size={24}/></Icon>Select course</Header>
        <Header><Icon><MdKeyboardArrowRight size={24}/></Icon>Select exercise</Header>
        <SubmissionAndReview>
          <SubmissionList>
            <Header noTopMargin><Icon><MdKeyboardArrowRight size={24}/></Icon>Select submission</Header>
            <SelectSubmissionList onSelect={handleSelectSubmission}/>
          </SubmissionList>
          <Review>
            <Header noTopMargin>Add review(s)</Header>
            <MoreReviewsList>
              { reviews.map((r, i) =>
              <MoreReviewItem key={i} selected={i === currentReviewIdx}>
                <MoreReviewButton selected={i === currentReviewIdx} onClick={() => setCurrentReviewIdx(i)}>
                  {i + 1}
                </MoreReviewButton>
                <ReviewSelectedIcon className={i === currentReviewIdx ? '' : 'hidden'}>
                  <MdKeyboardArrowUp size={24}/>
                </ReviewSelectedIcon>
              </MoreReviewItem>
              )}
              <div><AddReviewButton onClick={handleAddReview}>New</AddReviewButton></div>
            </MoreReviewsList>
            <ReviewForm
              data={reviews[currentReviewIdx]}
              onUpdateReview={handleUpdateReview}
              onDelete={handleDeleteReview}
              onSubmit={handleSubmit}/>
          </Review>
        </SubmissionAndReview>
      </Body>
    </Container>
  )
}))

interface IFormProps {
  className?: string
  data: any
  onUpdateReview: (data: IReviewFormParams) => void
  onSubmit: (data: IReviewFormParams) => Promise<IReview | undefined>
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
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hasNoError()) {
      const payload = {
        message,
        metadata,
      }
      setSubmitInProgress(true)
      const result = await onSubmit(payload)
      if (result) {
        setSubmitInProgress(false)
        onDelete()
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

const Container = styled.div`
  margin: 40px auto 20px auto;
  max-width: 880px;
  @media only screen and (max-width: 920px) {
    margin: 40px 20px 20px 20px;
  }
`
const Header = styled.h2<{ noTopMargin?: boolean }>`
  display: flex;
  margin-top: ${({ noTopMargin }) => noTopMargin && 0};
  & > ${Icon} {
    margin-right: 1rem;
  }
`
const Body = styled.section`
`
const SubmissionAndReview = styled.section`
  display: flex;
  width: 100%;
`
const SubmissionList = styled.div`
  margin-right: 1rem;
  width: 50%;
`
const MoreReviewsList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
`
const MoreReviewItem = styled.li<{ selected: boolean }>`  
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 1rem;
`
const MoreReviewButton = styled.button<{ selected: boolean }>`
  border: 1px solid transparent;
  border-radius: 0.1rem;
  color: #222;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  &:hover {
    border: 1px solid black;
  }
`
const AddReviewButton = styled.button`
  background: ${({ theme }) => theme.color.primary};
  border: 0;
  border-radius: 0.1rem;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  &:hover {
    background: ${({ theme }) => theme.color.secondary};
  }
`
const ReviewSelectedIcon = styled.span`
  margin-top: -4px;
  &.hidden {
    visibility: hidden;
  }
`
const Review = styled.div`
  width: 50%;
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
const Buttons = styled.div`
  display: flex;
  & > *:first-child {
    margin-right: 1rem;
  }
`
