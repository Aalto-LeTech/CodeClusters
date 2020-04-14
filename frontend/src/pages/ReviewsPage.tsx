import React from 'react'
import styled from '../theme/styled'

import { ReviewsView } from '../components/ReviewsPage'
import { SubmissionReviewsModal } from '../modals/SubmissionReviewsModal'
import { DeleteReviewsModal } from '../modals/DeleteReviewsModal'

export const ReviewsPage = () => {
  return (
    <Container>
      <ReviewsView />
      <SubmissionReviewsModal />
      <DeleteReviewsModal />
    </Container>
  )
}

const Container = styled.div`
`
