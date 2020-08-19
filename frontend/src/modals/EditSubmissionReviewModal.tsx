import React, { useEffect, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiX, FiMaximize2 } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'
import useScrollLock from '../hooks/useScrollLock'

import { Modal } from '../elements/Modal'
import { Review } from '../components/Review/Review'
import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'
import { CodeBlock } from '../components/CodeBlock'

import { Stores } from '../stores'
import { IModal, EModal } from '../stores/ModalStore'
import { IReview, IReviewSubmission, ISubmission } from 'shared'

interface IProps {
  className?: string
  modal?: {
    isOpen: false,
    params: {
      submission: ISubmission,
      review: IReview,
      reviewSubmission?: IReviewSubmission,
    }
  }
  closeModal?: (modal: EModal) => void
  upsertReviewSubmission?: (reviewSubmission: IReviewSubmission) => Promise<boolean | undefined>
  deleteReviewSubmission?: (reviewId: number, submissionId: string) => Promise<boolean | undefined>
}

export const EditSubmissionReviewModal = inject((stores: Stores) => ({
  modal: stores.modalStore.modals[EModal.EDIT_SUBMISSION_REVIEW],
  closeModal: stores.modalStore.closeModal,
  upsertReviewSubmission: stores.reviewStore.upsertReviewSubmission,
  deleteReviewSubmission: stores.reviewStore.deleteReviewSubmission,
}))
(observer((props: IProps) => {
  const { className, modal, closeModal, upsertReviewSubmission, deleteReviewSubmission } = props
  const [loading, setLoading] = useState(false)
  const [hasCurrentReview, setHasCurrentReview] = useState(false)
  const [review, setReview] = useState<IReview | undefined>(undefined)
  const [rawCode, setRawCode] = useState('')
  const [selection, setSelection] = useState<[number, number]>([0, 0])

  useEffect(() => {
    const selection = modal!.params?.reviewSubmission?.selection || [0, 0]
    if (modal!.params?.submission) {
      setRawCode(modal!.params.submission?.code)
    }
    setReview(modal!.params?.review)
    setHasCurrentReview(modal!.params.reviewSubmission !== undefined)
    setSelection(selection)
  }, [modal!.params])

  function handleCodeSelect(start: number, end: number) {
    setHasCurrentReview(true)
    setSelection([start, end])
  }
  function handleClose() {
    closeModal!(EModal.EDIT_SUBMISSION_REVIEW)
  }
  async function onUpdate() {
    let result
    if (hasCurrentReview) {
      result = await upsertReviewSubmission!({
        review_id: modal!.params.review.review_id,
        submission_id: modal!.params.submission.submission_id,
        selection,
      })
    }
    if (result) {
      handleClose()
    }
  }
  async function onToggleAssociation() {
    let result
    if (hasCurrentReview) {
      setLoading(true)
      result = await deleteReviewSubmission!(modal!.params.review.review_id, modal!.params.submission.submission_id)
    } else {
      setLoading(true)
      result = await upsertReviewSubmission!({
        review_id: modal!.params.review.review_id,
        submission_id: modal!.params.submission.submission_id,
        selection,
      })
    }
    setHasCurrentReview(!hasCurrentReview)
    setLoading(false)
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
            <TitleWrapper><h2>Link submission to review</h2></TitleWrapper>
            <Icon button onClick={handleClose}><FiX size={24}/></Icon>
          </Header>
          <Content>
            <SubTitle>Review</SubTitle>
            {review && <Review review={review} /> }
            <SubmissionHeader>
              <SubTitle>Submission</SubTitle>
              <div><IsLinkedTag linked={hasCurrentReview}>{hasCurrentReview ? 'Linked' : 'Unlinked'}</IsLinkedTag></div>
            </SubmissionHeader>
            <p>
              You may also edit the selection associated to this submission. By default the selection is the whole document. It's shown alongside the review to the student.
            </p>
            <CodeBlock
              code={rawCode}
              selectionStart={selection ? selection[0] : -1}
              selectionEnd={selection ? selection[1] : -1}
              onSelectCode={handleCodeSelect}
            />
          </Content>
          <Buttons>
            <Button intent={hasCurrentReview ? 'danger' : 'success'} loading={loading} onClick={onToggleAssociation}>
              {hasCurrentReview ? 'Unlink' : 'Link'}
            </Button>
            <Button intent="success" onClick={onUpdate}>Update</Button>
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
  height: 100%;
  justify-content: space-between;
  max-height: 1000px;
  max-width: 700px;
  padding: 20px;
  width: calc(100% - 20px - 2rem);
  /* @media only screen and (max-width: ${({ theme }) => theme.breakpoints.DEFAULT_WIDTH}) {
    max-width: 600px;
  } */
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
    margin: 0;
    padding: 0;
  }
`
const Content = styled.div`
  margin-bottom: 1rem;
  overflow-y: scroll;
  /* max-width: 700px; */
  width: 100%;
  & > * {
    margin: 1rem 0;
  }
`
const SubTitle = styled.h4``
const SubmissionHeader = styled.div`
  align-items: center;
  display: flex;
  margin-top: 2rem;
  & > ${SubTitle} {
    margin: 0 1rem 0 0;
  }
`
const IsLinkedTag = styled.span<{ linked: boolean }>`
  color: #fff;
  font-size: 1rem;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  background: ${({ linked, theme }) => linked ? theme.color.green : theme.color.red};
  border-radius: 4px;
  padding: 4px 8px;
`
const Buttons = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  & > * + * {
    margin-left: 1rem;
  }
`
