import React, { useState } from 'react'
import styled from '../../theme/styled'

import { ReviewsList } from './ReviewsList'

import { IReviewedSubmission, IReviewBody } from '@codeclusters/types'

interface IProps {
  className?: string
  isStudent: boolean
  reviewedSubmissions: IReviewedSubmission[]
}

ReviewedSubmissionsListEl.defaultProps = {
  isStudent: false,
  reviewedSubmissions: []
}

function ReviewedSubmissionsListEl(props: IProps) {
  const { className, isStudent, reviewedSubmissions } = props
  return (
    <ReviewedSubmissionsListUl className={className}>
      { reviewedSubmissions.map((submission: IReviewedSubmission, i: number) =>
      <ReviewedSubmissionsListItem key={`s-${i}`}>
        <ReviewsList submission={submission}/>
      </ReviewedSubmissionsListItem>
      )}
    </ReviewedSubmissionsListUl>
  )
}

const ReviewedSubmissionsListUl = styled.ul`
`
const ReviewedSubmissionsListItem = styled.li`
`

export const ReviewedSubmissionsList = styled(ReviewedSubmissionsListEl)``
