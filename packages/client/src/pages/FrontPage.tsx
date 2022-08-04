import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FaGithub } from 'react-icons/fa'

import { SearchView } from '../components/Search'
import { DeleteReviewSelectionModal } from '../modals/DeleteReviewSelectionModal'
import { AddReviewModal } from '../modals/AddReviewModal'
import { CreateReviewFlowModal } from '../modals/CreateReviewFlowModal'
import { FloatingMenu } from '../components/FloatingMenu'
import { Icon } from '../elements/Icon'

import { Stores } from '../stores/Stores'

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
        <a href="https://github.com/Aalto-LeTech/CodeClusters" target="_blank">
          <h1>CodeClusters</h1>
          <Icon><FaGithub size={20}/></Icon>
        </a>
      </Header>
      <SearchView/>
      <DeleteReviewSelectionModal />
      <AddReviewModal />
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
  & > a {
    align-items: center;
    display: flex;
    & > ${Icon} {
      margin: 0.5rem 0 0 0.5rem;
    }
  }
`
