import React from 'react'
import styled from '../theme/styled'

import { ReviewsView } from '../components/ReviewsPage'
import { AcceptEditReviewModal } from '../modals/AcceptEditReviewModal'
import { SubmissionReviewsModal } from '../modals/ViewSubmissionReviewsModal'
import { DeleteReviewsModal } from '../modals/DeleteReviewsModal'
import { EditSubmissionReviewModal } from '../modals/EditSubmissionReviewModal'

export const ReviewsPage = () => {
  return (
    <Container>
      <ReviewsView />
      <AcceptEditReviewModal />
      <SubmissionReviewsModal />
      <DeleteReviewsModal />
      <EditSubmissionReviewModal />
    </Container>
  )
}

const Container = styled.div`
`
