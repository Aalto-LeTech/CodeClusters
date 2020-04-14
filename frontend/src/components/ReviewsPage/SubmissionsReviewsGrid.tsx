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
  getPendingReviews?: (courseId?: number, exerciseId?: number) => Promise<any>
  getSubmissions?: (courseId?: number, exerciseId?: number) => Promise<any>
  openSubmissionReviewsModal?: (params: any) => void
}

const SubmissionsReviewsGridEl = inject((stores: Stores) => ({
  reviews: stores.reviewStore.reviews,
  reviewSubmissions: stores.reviewStore.reviewSubmissions,
  submissions: stores.submissionStore.submissions,
  getPendingReviews: stores.reviewStore.getPendingReviews,
  getSubmissions: stores.submissionStore.getSubmissions,
  openSubmissionReviewsModal: (params: any) => stores.modalStore.openModal(EModal.SUBMISSION_REVIEWS, params),
}))
(observer((props: IProps) => {
  const {
    className, reviews, reviewSubmissions, submissions, getPendingReviews, getSubmissions, openSubmissionReviewsModal
  } = props
  const [submissionReviewsRows, setSubmissionReviewsRows] = useState([] as (IReviewSubmission | undefined)[][])
  const [editedReviewId, setEditedReviewId] = useState(-1)

  useEffect(() => {
    getPendingReviews!()
    getSubmissions!()
  }, [])
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
  return (
    <ReviewsTable className={className}>
      <THead>
        <tr>
          <Th padding>Submission</Th>
          { reviews!.map(r =>
          <ReviewTh
            key={r.review_id}
            review={r}
            active={editedReviewId === r.review_id}
            closeEditReviewMenu={() => setEditedReviewId(-1)}
            onClick={() => setEditedReviewId(r.review_id)}
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
}
function SubmissionRow(props: ISubmissionRowProps) {
  const { submission, submissionReviews = [], onSubmissionThClick } = props
  return (
    <tr>
      <SubmissionTh tabIndex={0} onClick={() => onSubmissionThClick(submission)}>
        {submission.submission_id.substring(0, 5)}
      </SubmissionTh>
      { submissionReviews.map((sr, j) =>
        <SubmissionColumn
          key={`row-${submission.submission_id}-col-${j}`}
          reviewSubmission={sr}
        />
      )}
    </tr>
  )
}

interface ISubmissionColumnProps {
  reviewSubmission?: IReviewSubmission
}
function SubmissionColumn(props: ISubmissionColumnProps) {
  const { reviewSubmission } = props
  if (!reviewSubmission) {
    return <td></td>
  }
  const hasSelection = !reviewSubmission!.selection.every((e: number) => e === 0)
  return (
    <td
      className={'top selected'}
      data-tooltip={hasSelection ? `Line: ${reviewSubmission!.selection[0]}` : undefined}
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
      background: ${({ theme }) => theme.color.gray.light};
    }
  }
  [data-tooltip] {
    position: relative;
    z-index: 1;
    &.left:before {
      left: -125%;
    }  
    &.top:before {
      top: -110%;
    }
    &.right:before {
      right: -125%;
    }
    &.bottom:before {
      bottom: -110%;
    }
  }
  [data-tooltip]:before {
    border-radius: 4px;
    box-shadow: 2px 2px 1px silver;
    color: #fff;
    content: attr(data-tooltip);
    opacity: 0;
    padding: 10px;
    position: absolute;
    transition: all 0.15s ease;
    width: max-content;
  }
  [data-tooltip]:hover:before {
    background: #222;
    opacity: 1;
  }
  [data-tooltip]:not([data-tooltip-persistent]):before {
    pointer-events: none;
  }
`
const THead = styled.thead``
const Th = styled.th<{ padding?: boolean }>`
  padding-right: ${({ padding }) => padding && '1rem'};
  width: 75px;
`
const SubmissionTh = styled.th`
  border-radius: 2px;
  cursor: pointer;
  width: 75px;
  &:hover {
    background: ${({ theme }) => theme.color.gray.light};
  }
`
const TBody = styled.tbody`
  border: 1px solid #e0e0dc;
`

export const SubmissionsReviewsGrid = styled(SubmissionsReviewsGridEl)``
