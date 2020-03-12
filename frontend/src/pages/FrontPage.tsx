import React from 'react'
import { inject } from 'mobx-react'
import styled from '../theme/styled'

import { SearchView } from '../components/Search'
import { DeleteReviewSelectionModal } from '../modals/DeleteReviewSelectionModal'

import { Stores } from '../stores'
import { AuthStore } from '../stores/AuthStore'

interface IProps {
  authStore?: AuthStore,
}

@inject((stores: Stores) => ({
  authStore: stores.authStore,
}))
export class FrontPage extends React.PureComponent<IProps> {
  render() {
    return (
      <Container>
        <SearchView />
        <DeleteReviewSelectionModal />
        <header>
          <h1><a href="https://github.com/Aalto-LeTech/CodeClusters">Code Clusters</a></h1>
          <p><i>The tool to solve all your problems...</i></p>
        </header>
        <ImgContainer>
          <img width={1200} src={'/img/architecture.jpg'} alt="Architecture"/>
        </ImgContainer>
      </Container>
    )
  }
}

const Container = styled.div`
`
const ImgContainer = styled.figure`
  & > img {
    position: absolute;
    max-width: 100vw;
    left: 0;
    padding: 1rem;
  }
`
