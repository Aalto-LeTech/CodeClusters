import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { ReviewStore } from '../stores/ReviewStore'

interface IProps {
  reviewStore: ReviewStore,
}

export const ReviewViewPage = inject('reviewStore')(observer((props: IProps) => {
  const { reviewStore } = props
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
  }, [])
  return (
    <Container>
      <header>
        <h1>Review</h1>
      </header>
      <Body>
      </Body>
    </Container>
  )
}))

const Container = styled.div`
`
const Body = styled.section`
`
