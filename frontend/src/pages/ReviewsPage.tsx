import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { ReviewStore } from '../stores/ReviewStore'
import { IReviewWithDate } from 'shared'

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
      <ReviewsList>
        { reviewStore.reviews.map((review: IReviewWithDate, i: number) =>
        <ReviewsListItem key={i}>
          <p>Submission id: {review.submission_id}</p>
          <p>{review.date.toISOString()}</p>
          <pre className="code">{review.metadata}</pre>
          <p className="message">{review.message}</p>
        </ReviewsListItem>
        )}
      </ReviewsList>
      }
    </Container>
  )
}))

const Container = styled.div`
`
const ReviewsList = styled.ul`
`
const ReviewsListItem = styled.li`
  background: #ededed;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  margin: 0 0 10px 0;
  padding: 1rem;
  & > p {
    margin: 0 10px 0 0;
  }
  .code {
    background: #222;
    color: #fff;
    padding: 10px;
    border-radius: 0.25rem;
  }
  .message {
    background: rgba(255, 0, 0, 0.4);
    padding: 1rem;
    border-radius: 0.25rem;
  }
`
