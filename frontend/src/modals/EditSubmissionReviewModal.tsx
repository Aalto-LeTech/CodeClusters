import React, { useEffect, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'
import useScrollLock from '../hooks/useScrollLock'

import { Modal } from '../elements/Modal'
import { Review } from '../components/Review/Review'
import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'
import { CodeBlock } from '../components/CodeBlock'

import { Stores } from '../stores'
import { IModal, EModal } from '../stores/ModalStore'
import { IReview, IReviewSubmission } from 'shared'

interface IProps {
  className?: string
  modal?: IModal
  closeModal?: (modal: EModal) => void
  updateReviewSubmission?: (reviewSubmission: IReviewSubmission) => Promise<boolean | undefined>
  deleteReviewSubmission?: (reviewSubmission: IReviewSubmission) => Promise<boolean | undefined>
}

export const EditSubmissionReviewModal = inject((stores: Stores) => ({
  modal: stores.modalStore.modals[EModal.EDIT_SUBMISSION_REVIEW],
  closeModal: stores.modalStore.closeModal,
  updateReviewSubmission: stores.reviewStore.upsertReviewSubmission,
  deleteReviewSubmission: stores.reviewStore.deleteReviewSubmission,
}))
(observer((props: IProps) => {
  const { className, modal, closeModal, updateReviewSubmission, deleteReviewSubmission } = props
  const [hasCurrentReview, setHasCurrentReview] = useState(false)
  const [review, setReview] = useState<IReview | undefined>(undefined)
  const [codeLines, setCodeLines] = useState<string[]>([])
  const [selection, setSelection] = useState<[number, number, number]>([0, 0, 0])

  useEffect(() => {
    const selection = modal!.params?.reviewSubmission?.selection || [0, 0, 0]
    if (modal!.params?.submission) {
      setCodeLines(modal!.params.submission?.code.split("\n"))
    }
    setReview(modal!.params?.review)
    setHasCurrentReview(modal!.params.reviewSubmission !== undefined)
    setSelection(selection)
  }, [modal!.params])

  function handleCodeLineClick(idx: number) {
    const selection = codeLines.reduce((acc, cur, i) => {
      if (i < idx) {
        acc[1] += cur.length + 1 // TODO remove +1 ?
      } else if (i === idx) {
        acc[2] = acc[1] + 1 + cur.length
      }
      return acc
    }, [idx, 0, 0] as [number, number, number])
    setHasCurrentReview(true)
    setSelection(selection)
  }
  function handleClose() {
    closeModal!(EModal.EDIT_SUBMISSION_REVIEW)
  }
  async function onUpdate() {
    let result
    if (hasCurrentReview) {
      result = await updateReviewSubmission!({
        review_id: modal!.params.review.review_id,
        submission_id: modal!.params.submission.submission_id,
        selection,
      })
    }
    if (result) {
      handleClose()
    }
  }
  async function onDelete() {
    const result = await deleteReviewSubmission!(modal!.params.reviewSubmission)
    if (result) {
      handleClose()
    }
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
            <TitleWrapper><h2>Edit submission review</h2></TitleWrapper>
            <Icon button onClick={handleClose}><FiX size={24}/></Icon>
          </Header>
          <Content>
            {review && <Review review={review} /> }
            <CodeBlock
              codeLines={codeLines}
              activeSelection={selection}
              showMenu={false}
              onSelectCodeLine={handleCodeLineClick}
            />
          </Content>
          <Buttons>
            <Button intent="danger" disabled={modal!.params.reviewSubmission === undefined} onClick={onDelete}>
              Delete
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
  max-width: 1200px;
  padding: 20px;
  width: calc(100% - 20px - 2rem);
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.DEFAULT_WIDTH}) {
    max-width: 600px;
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
const Content = styled.div`
  margin-bottom: 1rem;
  overflow-y: scroll;
  width: 100%;
  & > ${CodeBlock} {
    height: 100%;
    min-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    width: max-content;
  }
`
const ReviewField = styled.div`
  margin-bottom: 1rem;
  & > p {
    border: 1px solid #222;
    border-radius: 4px;
    margin: 0;
    padding: 10px;
  }
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
