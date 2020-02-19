import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { ReviewsList } from '../components/ReviewsList'

import { RouteComponentProps } from 'react-router'
import { ReviewStore } from '../stores/ReviewStore'

interface IProps extends RouteComponentProps<{ userId?: string }> {
  reviewStore: ReviewStore,
}

export const ReviewViewPage = inject('reviewStore')(observer((props: IProps) => {
  const { reviewStore, match } = props
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetchReviews()
  }, [])
  async function fetchReviews() {
    if (!match.params.userId) {
      return
    }
    setLoading(true)
    let userId
    try {
      userId = parseInt(match.params.userId)
      await reviewStore!.getUserReviews(userId)
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }
  return (
    <Container>
      <header>
        <h1>Review</h1>
      </header>
      <Body>
        { loading ? 'Loading' :
        <ReviewsList isStudent reviews={reviewStore!.reviews}/>
        }
      </Body>
    </Container>
  )
}))

const Container = styled.div`
`
const Body = styled.section`
`