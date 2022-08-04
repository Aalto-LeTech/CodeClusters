import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'
import { FiCheck, FiEdit2, FiTrash, FiAlignLeft } from 'react-icons/fi'

import { IReview, IReviewSubmission, ISubmission } from '@codeclusters/types'
import { Stores } from '../../stores/Stores'

interface IProps {
  className?: string
  reviews?: IReview[]
  reviewSubmissions?: IReviewSubmission[]
  submissions?: ISubmission[]
}

const ReviewStatsEl = inject((stores: Stores) => ({
  reviews: stores.reviewStore.reviews,
  reviewSubmissions: stores.reviewStore.reviewSubmissions,
  submissions: stores.submissionStore.submissions,
}))
(observer((props: IProps) => {
  const {
    className, reviews, reviewSubmissions, submissions
  } = props

  return (
    <Container className={className}>
      <SubmissionCount>Submissions: {submissions!.length}</SubmissionCount>
      <ReviewCount>Reviews: {reviews!.length}</ReviewCount>
      <ReviewedSubmissionsCount>Reviewed Submissions: {reviewSubmissions!.length}</ReviewedSubmissionsCount>
    </Container>
  )
}))

const Container = styled.div``
const SubmissionCount = styled.div``
const ReviewCount = styled.div``
const ReviewedSubmissionsCount = styled.div``

export const ReviewStats = styled(ReviewStatsEl)``
