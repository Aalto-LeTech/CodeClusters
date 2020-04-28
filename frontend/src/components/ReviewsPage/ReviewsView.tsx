import React, { memo, useState } from 'react'
import styled from 'styled-components'

import { FetchReviewsButton } from './FetchReviewsButton'
import { SelectCourseExercise } from '../SelectCourseExercise'
import { SubmissionsReviewsGrid } from './SubmissionsReviewsGrid'
import { PendingSentToggle } from './PendingSentToggle'
import { ReviewStats } from './ReviewStats'
import { ReviewSubmissionsControls } from './ReviewSubmissionsControls'

interface IProps {
  className?: string
}

const ReviewsViewEl = memo((props: IProps) => {
  const { className } = props
  return (
    <Wrapper className={className}>
      <Container>
        <header>
          <h1>Reviews</h1>
        </header>
        <MainInputs>
          <SelectCourseExercise />
          <PendingSentToggle />
          <FetchReviewsButton />
        </MainInputs>
        <ReviewStats />
        <ReviewSubmissionsControls />
      </Container>
      <TableWrapper>
        <SubmissionsReviewsGrid />
      </TableWrapper>
    </Wrapper>
  )
})

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  > * + * {
    margin: 2rem 0;
  }
  h1 {
    margin: 2rem 0;
  }
`
const MainInputs = styled.div`
  > * + * {
    margin: 1rem 0;
  }
`
const TableWrapper = styled.div`
  margin-bottom: 2rem;
  overflow: auto;
`

export const ReviewsView = styled(ReviewsViewEl)``
