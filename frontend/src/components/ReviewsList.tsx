import React from 'react'
import styled from '../theme/styled'

import { IReviewWithDate } from 'shared'

interface IProps {
  className?: string
  isStudent: boolean
  reviews: IReviewWithDate[]
}

ReviewsListEl.defaultProps = {
  isStudent: false,
  reviews: []
}

function ReviewsListEl(props: IProps) {
  const { className, isStudent, reviews } = props
  return (
    <ReviewsListUl className={className}>
      { reviews.map((review: IReviewWithDate, i: number) =>
      <ReviewsListItem key={i}>
        <p>Submission id: {review.submission_id}</p>
        <p>{review.date.toISOString()}</p>
        { !isStudent && <pre className="code">{review.metadata}</pre> }
        <p className="message">{review.message}</p>
      </ReviewsListItem>
      )}
    </ReviewsListUl>
  )
}

const ReviewsListUl = styled.ul`
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

export const ReviewsList = styled(ReviewsListEl)``
