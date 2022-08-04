import React from 'react'
import styled from '../theme/styled'

import { SolrView } from '../components/SolrPage/SolrView'
import { CreateReviewFlowModal } from '../modals/CreateReviewFlowModal'

interface IProps {}

export const SolrPage = (props: IProps) => {
  return (
    <Container>
      <SolrView />
      <CreateReviewFlowModal />
    </Container>
  )
}

const Container = styled.div``
