import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { SearchView } from '../components/SearchPage'
import { DeleteReviewSelectionModal } from '../modals/DeleteReviewSelectionModal'
import { ReviewSubmissionsModal } from '../modals/ReviewSubmissionsModal'
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
        <a href="https://github.com/Aalto-LeTech/CodeClusters"><h1>Code Clusters</h1></a>
      </Header>
      <SearchView/>
      <DeleteReviewSelectionModal />
      <ReviewSubmissionsModal />
      <FloatingMenu />
      <ImgContainer>
        <img width={1200} src={'/img/architecture.jpg'} alt="Architecture"/>
      </ImgContainer>
    </Container>
  )
}))

const Container = styled.div`
`
const Header = styled.header`
  display: flex;
  justify-content: center;
  & > h1 {

  }
`
const ImgContainer = styled.figure`
  & > img {
    position: absolute;
    max-width: 100vw;
    left: 0;
    padding: 1rem;
  }
`
