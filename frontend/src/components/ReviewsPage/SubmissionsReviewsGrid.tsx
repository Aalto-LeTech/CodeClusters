import React, { useEffect, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'
import { FiCheck, FiEdit2, FiTrash, FiAlignLeft } from 'react-icons/fi'

import useHover from '../../hooks/useHover'

import { Icon } from '../../elements/Icon'
import { ReviewTh } from './ReviewTh'

import { IReview, IReviewSubmission, ISubmission } from 'shared'
import { Stores } from '../../stores'
import { EModal } from '../../stores/ModalStore'

interface IProps {
  className?: string
  reviews?: IReview[]
  reviewSubmissions?: IReviewSubmission[]
  submissions?: ISubmission[]
  openModal?: (modal: EModal, params: any) => void
}

const SubmissionsReviewsGridEl = inject((stores: Stores) => ({
  reviews: stores.reviewStore.reviews,
  reviewSubmissions: stores.reviewStore.reviewSubmissions,
  submissions: stores.submissionStore.submissions,
  openModal: stores.modalStore.openModal,
}))
(observer((props: IProps) => {
  const {
    className, reviews, reviewSubmissions, submissions, openModal
  } = props
  const [submissionReviewsRows, setSubmissionReviewsRows] = useState([] as (IReviewSubmission | undefined)[][])
  const [editedReviewId, setEditedReviewId] = useState(-1)

  useEffect(() => {
    if (reviews!.length > 0 && reviewSubmissions!.length > 0 && submissions!.length > 0) {
      const mat = Array(submissions!.length).fill(undefined).map(_ => Array(reviews!.length).fill(undefined))
      for (let i = 0; i < submissions!.length; i += 1) {
        for (let j = 0; j < reviews!.length; j += 1) {
          const s = submissions![i]
          const r = reviews![j]
          const found = reviewSubmissions!.find(rs => rs.review_id === r.review_id && rs.submission_id === s.submission_id)
          mat[i][j] = found
        }
      }
      setSubmissionReviewsRows(mat)
    } else {
      setSubmissionReviewsRows([])
    }
  }, [reviews, reviewSubmissions, submissions])
  const ref = useRef(null)
  useHover(ref, (e: MouseEvent) => handleHover(e), true)

  function openEditSubmissionReviewModal(params: any) {
    openModal!(EModal.EDIT_SUBMISSION_REVIEW, params)
  }
  function openSubmissionReviewsModal(params: any) {
    openModal!(EModal.VIEW_SUBMISSION_REVIEWS, params)
  }
  function openAcceptEditReviewModal(review: IReview) {
    openModal!(EModal.ACCEPT_EDIT_REVIEW, { review })
  }
  function handleHover(e: MouseEvent) {
    // console.log(e)
  }
  function handleSubmissionThClick(submission: ISubmission) {
    const foundReviewSubmissions = reviewSubmissions!.filter(rs => rs.submission_id === submission.submission_id)
    const reviewSubmissionReviewIds = foundReviewSubmissions.map(rs => rs.review_id)
    const foundReviews = reviews!.filter(r => reviewSubmissionReviewIds.includes(r.review_id))
    const reviewsWithSelection = foundReviews.map(r => (
      { ...r, selection: foundReviewSubmissions.find(rs => rs.review_id === r.review_id)?.selection }
    ))
    openSubmissionReviewsModal!({
      submission,
      reviews: reviewsWithSelection
    })
  }
  function handleSubmissionCellClick(submission: ISubmission, colIdx: number, reviewSubmission?: IReviewSubmission) {
    openEditSubmissionReviewModal!({
      submission,
      review: reviews![colIdx],
      reviewSubmission,
    })
  }
  return (
    <ReviewsTable className={className} cellPadding="0" cellSpacing="0">
      <THead>
        <tr>
          <Th>Submission</Th>
          <Th>Length</Th>
          { reviews!.map(r =>
          <ReviewTh
            key={`rth-${r.review_id}`}
            review={r}
            onClick={() => openAcceptEditReviewModal(r)}
          />)}
        </tr>
      </THead>
      <TBody ref={ref}>
        { submissions!.map((s, i) =>
        <SubmissionRow
          key={`row-${s.submission_id}`}
          submission={s}
          submissionReviews={submissionReviewsRows[i]}
          onSubmissionThClick={handleSubmissionThClick}
          onCellClick={handleSubmissionCellClick}
        />
        )}
      </TBody>
    </ReviewsTable>
  )
}))

interface ISubmissionRowProps {
  submission: ISubmission
  submissionReviews: (IReviewSubmission | undefined)[]
  onSubmissionThClick: (submission: ISubmission) => void
  onCellClick: (submission: ISubmission, colIdx: number, reviewSubmission?: IReviewSubmission) => void
}
function SubmissionRow(props: ISubmissionRowProps) {
  const { submission, submissionReviews = [], onSubmissionThClick, onCellClick } = props
  return (
    <tr>
      <SubmissionTh tabIndex={0} onClick={() => onSubmissionThClick(submission)}>
        {submission.submission_id.substring(0, 5)}
      </SubmissionTh>
      <th>{submission.code.length}</th>
      { submissionReviews.map((sr, j) =>
        <SubmissionColumn
          key={`row-${submission.submission_id}-col-${j}`}
          reviewSubmission={sr}
          onCellClick={() => onCellClick(submission, j, sr)}
        />
      )}
    </tr>
  )
}

interface ISubmissionColumnProps {
  reviewSubmission?: IReviewSubmission
  onCellClick: () => void
}
function SubmissionColumn(props: ISubmissionColumnProps) {
  const { reviewSubmission, onCellClick } = props
  if (!reviewSubmission) {
    return <td onClick={onCellClick}></td>
  }
  const hasSelection = !reviewSubmission!.selection.every((e: number) => e === 0)
  return (
    <td
      className={'selected'}
      onClick={onCellClick}
    >
      { hasSelection ?
      <Icon><FiAlignLeft size={14} /></Icon> :
      null
      }
    </td>
  )
}

const ReviewsTable = styled.table`
  td {
    border: 1px solid #222;
    cursor: pointer;
    &.selected {
      background: ${({ theme }) => theme.color.green};
    }
    &:hover {
      background: ${({ theme }) => theme.color.primaryLight};
    }
  }
`
const THead = styled.thead``
const Th = styled.th`
  font-size: 0.8rem;
  padding: 0 0.25rem;
`
const SubmissionTh = styled.th`
  border-radius: 2px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.color.primaryLight};
  }
`
const TBody = styled.tbody`
  border: 1px solid #e0e0dc;
`

export const SubmissionsReviewsGrid = styled(SubmissionsReviewsGridEl)``
