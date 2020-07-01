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
        <Header>
          <h1>Reviews</h1>
          <p>
            Here you can see the sent and pending reviews for a given course and/or exercise. You may edit the reviews themselves,
            the selections of the lines associated to submission's review or to which students they are given.
            If everything looks fine you may then accept the reviews, only after which the reviews become visible to the student.
          </p>
        </Header>
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
`
const Header = styled.header`
  max-width: 700px;
  & > h1 {
    text-align: center;
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
