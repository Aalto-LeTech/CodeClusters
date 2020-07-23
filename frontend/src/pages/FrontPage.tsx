import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'

import { SearchView } from '../components/Search'
import { DeleteReviewSelectionModal } from '../modals/DeleteReviewSelectionModal'
import { ReviewSubmissionsModal } from '../modals/AddReviewModal'
import { CreateReviewFlowModal } from '../modals/CreateReviewFlowModal'
import { FloatingMenu } from '../components/FloatingMenu'

import { Stores } from '../stores'

interface IProps {
  getSearchSupplementaryData?: () => Promise<any>
}

export const FrontPage = inject((stores: Stores) => ({
  getSearchSupplementaryData: stores.searchFacetsStore.getSearchSupplementaryData,
}))
(observer((props: IProps) => {
  const { getSearchSupplementaryData } = props
  useEffect(() => {
    getSearchSupplementaryData!()
  }, [])
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
