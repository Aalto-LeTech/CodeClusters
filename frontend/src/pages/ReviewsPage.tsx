import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { SubmissionsReviewsGrid } from '../components/ReviewsPage/SubmissionsReviewsGrid'
import { Button } from '../elements/Button'
import { SubmissionReviewsModal } from '../modals/SubmissionReviewsModal'

import { ReviewStore } from '../stores/ReviewStore'

interface IProps {
  reviewStore: ReviewStore,
}

export const ReviewsPage = inject('reviewStore')(observer((props: IProps) => {
  return (
    <Container>
      <header>
        <h1>Pending Reviews</h1>
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
      <SubmissionsReviewsGrid />
      <SubmissionReviewsModal />
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
