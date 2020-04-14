import React, { memo, useState } from 'react'
import styled from 'styled-components'

import { Button } from '../../elements/Button'
import { SelectCourseExercise } from '../SelectCourseExercise'
import { SubmissionsReviewsGrid } from './SubmissionsReviewsGrid'
import { ReviewStats } from './ReviewStats'
import { ReviewSubmissionsControls } from './ReviewSubmissionsControls'

interface IProps {
  className?: string
}

const ReviewsViewEl = memo((props: IProps) => {
  const { className } = props
  return (
    <Container className={className}>
      <header>
        <h1>Pending Reviews</h1>
      </header>
      <SelectCourseExercise />
      <ReviewStats />
      <ReviewSubmissionsControls />
      <SubmissionsReviewsGrid />
    </Container>
  )
})

const Container = styled.section`
  > * + * {
    margin: 2rem 0;
  }
  h1 {
    margin: 2rem 0;
  }
`
const Buttons = styled.div`
  display: flex;
  width: 600px;
  > * + * {
    margin-left: 1rem;
  }
`

export const ReviewsView = styled(ReviewsViewEl)``
