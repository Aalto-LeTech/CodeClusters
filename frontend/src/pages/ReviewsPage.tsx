import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { ReviewedSubmissionsList } from '../components/ReviewsView'

import { ReviewStore } from '../stores/ReviewStore'

interface IProps {
  reviewStore: ReviewStore,
}

export const ReviewsPage = inject('reviewStore')(observer((props: IProps) => {
  const { reviewStore } = props
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    reviewStore.getReviews().then(() => {
      setLoading(false)
    })
  }, [reviewStore])
  return (
    <Container>
      <header>
        <h1>Reviews</h1>
      </header>
      { loading ? 'Loading' :
      <ReviewedSubmissionsList reviewedSubmissions={reviewStore!.reviewedSubmissions}/>
      }
    </Container>
  )
}))

const Container = styled.div`
`
