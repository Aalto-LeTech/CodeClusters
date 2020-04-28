import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { Button } from '../../elements/Button'

import { Stores } from '../../stores'
import { EReviewStatus } from 'shared'

interface IProps {
  className?: string
  courseId?: number
  exerciseId?: number
  fetchedReviewsStatus?: EReviewStatus
  getPendingReviews?: (courseId?: number, exerciseId?: number) => Promise<any>
  getSubmissions?: (courseId?: number, exerciseId?: number) => Promise<any>
}

const FetchReviewsButtonEl = inject((stores: Stores) => ({
  courseId: stores.courseStore.courseId,
  exerciseId: stores.courseStore.exerciseId,
  fetchedReviewsStatus: stores.reviewStore.fetchedReviewsStatus,
  getPendingReviews: stores.reviewStore.getReviews,
  getSubmissions: stores.submissionStore.getSubmissions,
}))
(observer((props: IProps) => {
  const {
    className, courseId, exerciseId, getPendingReviews, getSubmissions
  } = props
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    Promise.all([
      getPendingReviews!(courseId, exerciseId),
      getSubmissions!(courseId, exerciseId)
    ])
    .then(_ => {
      setLoading(false)
    })
  }, [])
  function handleClickFetch() {
    setLoading(true)
    Promise.all([
      getPendingReviews!(courseId, exerciseId),
      getSubmissions!(courseId, exerciseId)
    ])
    .then(_ => {
      setLoading(false)
    })
  }
  return (
    <Container className={className}>
      { courseId === undefined ?
      <CheckBoxText>You have to select at least course</CheckBoxText>
      :
      <Button
        loading={loading}
        onClick={handleClickFetch}
      >Get reviews</Button>}
    </Container>
  )
}))

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`
const CheckBoxText = styled.label`
  align-items: center;
  background: #0094ff; // ${({ theme }) => theme.color.green};
  border-radius: 4px;
  color: #fff;
  display: flex;
  font-weight: bold;
  font-size: 1.25rem;
  padding: 0.5rem 0.75rem 0.5rem 1rem;
`

export const FetchReviewsButton = styled(FetchReviewsButtonEl)``
