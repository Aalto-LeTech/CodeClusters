import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { ReviewedSubmissionsList } from '../components/ReviewsView'
import { Button } from '../elements/Button'

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
      <Controls>
        <div>
          <div>status: pending</div>
          <div>course: 2</div>
          <div>exercise: 1</div>
        </div>
        <div>
          <div>100/112</div>
          <div>pagination?</div>
        </div>
      </Controls>
      <Buttons>
        <Button intent="success">Accept all</Button>
        <Button intent="danger">Reject all</Button>
      </Buttons>
      { loading ? 'Loading' :
      <ReviewedSubmissionsList reviewedSubmissions={reviewStore!.reviewedSubmissions}/>
      }
    </Container>
  )
}))

const Container = styled.div`
`
const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`
const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 600px;
  & > ${Button} {
    margin-bottom: 1rem;
    margin-right: 1rem;
  }
`
