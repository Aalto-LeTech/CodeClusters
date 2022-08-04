import React, { useState } from 'react'
import styled from '../../theme/styled'

import { IReviewedSubmission, IReviewBody } from '@codeclusters/types'

interface IProps {
  className?: string
  submission: IReviewedSubmission
}

function createCodeHTML(code: string, selection: [number, number]) {
  return `${code.substring(0, selection[0])}<mark>${code.substring(selection[0], selection[1])}</mark>${code.substring(selection[1])}`
}

function ReviewsListEl(props: IProps) {
  const { className, submission } = props
  const [shownReview, setShownReview] = useState(-1)
  const [codeHTML, setCodeHTML] = useState(submission.code)
  function handleReviewClick(review: IReviewBody, idx: number) {
    setShownReview(idx)
    setCodeHTML(createCodeHTML(submission.code, review.selection))
  }
  return (
    <Container>
      <Code dangerouslySetInnerHTML={{__html: codeHTML }} />
      <ReviewsListUl className={className}>
        { submission.reviews.map((review: IReviewBody, i: number) =>
        <ReviewItem key={`r-${i}`} active={i === shownReview} onClick={() => handleReviewClick(review, i)}>
          <p className="message">{review.message}</p>
          { review.metadata && <Code>{review.metadata}</Code> }
        </ReviewItem>
        )}
      </ReviewsListUl>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const ReviewsListUl = styled.ul`
`
const ReviewItem = styled.li<{ active: boolean}>`
  background: ${({ active, theme }) => active ? 'red' : '#ededed'};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  margin: 0 0 10px 0;
  padding: 1rem;
  &:hover {
    background: red;
  }
  & > p {
    margin: 0 10px 0 0;
  }
  .code {
    background: #222;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
  }
  .message {
    background: rgba(255, 0, 0, 0.4);
    padding: 1rem;
    border-radius: 4px;
  }
`
const Code = styled.pre`
  background: #222;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
`

export const ReviewsList = styled(ReviewsListEl)``
