import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { SearchView } from '../components/SearchPage'
import { DeleteReviewSelectionModal } from '../modals/DeleteReviewSelectionModal'
import { ReviewSubmissionsModal } from '../modals/ReviewSubmissionsModal'
import { CreateReviewFlowModal } from '../modals/CreateReviewFlowModal'
import { FloatingMenu } from '../components/FloatingMenu'

import { Stores } from '../stores'
import { AuthStore } from '../stores/AuthStore'

interface IProps {
  authStore?: AuthStore
}

export const FrontPage = inject((stores: Stores) => ({
  authStore: stores.authStore,
}))
(observer((props: IProps) => {
  return (
    <Container>
      <Header>
        <a href="https://github.com/Aalto-LeTech/CodeClusters" target="_blank"><h1>CodeClusters</h1></a>
      </Header>
      <SearchView/>
      <DeleteReviewSelectionModal />
      <ReviewSubmissionsModal />
      <CreateReviewFlowModal />
      <FloatingMenu />
    </Container>
  )
}))

const Container = styled.div`
`
const Header = styled.header`
  display: flex;
  justify-content: center;
`
