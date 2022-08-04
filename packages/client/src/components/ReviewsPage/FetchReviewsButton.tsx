import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { Button } from '../../elements/Button'

import { Stores } from '../../stores/Stores'
import { EReviewStatus } from '@codeclusters/types'

interface IProps {
  className?: string
  courseId?: number
  exerciseId?: number
  getPendingReviews?: (courseId?: number, exerciseId?: number) => Promise<any>
  getSubmissions?: (courseId?: number, exerciseId?: number) => Promise<any>
}

const FetchReviewsButtonEl = inject((stores: Stores) => ({
  courseId: stores.courseStore.courseId,
  exerciseId: stores.courseStore.exerciseId,
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
      <NoCourseText>You have to select at least course</NoCourseText>
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
const NoCourseText = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.color.primary};
  border-radius: 4px;
  color: #fff;
  display: flex;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
`

export const FetchReviewsButton = styled(FetchReviewsButtonEl)``
