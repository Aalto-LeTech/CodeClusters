import React from 'react'
import styled from '../theme/styled'

import { ReviewsView } from '../components/ReviewsPage'
import { SubmissionReviewsModal } from '../modals/SubmissionReviewsModal'
import { DeleteReviewsModal } from '../modals/DeleteReviewsModal'
import { EditSubmissionReviewModal } from '../modals/EditSubmissionReviewModal'

export const ReviewsPage = () => {
  return (
    <Container>
      <ReviewsView />
      <SubmissionReviewsModal />
      <DeleteReviewsModal />
      <EditSubmissionReviewModal />
    </Container>
  )
}

const Container = styled.div`
`
