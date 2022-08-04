import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiCheck, FiPlusSquare, FiFolderPlus, FiTrash } from 'react-icons/fi'

import { Icon } from '../elements/Icon'
import { Spinner } from '../elements/Spinner'

import { ISolrSubmissionWithDate, ISolrFullSubmissionWithDate } from '@codeclusters/types'
import { Stores } from '../stores'
import { EModal } from '../stores/ModalStore'

type SolrSubmission = ISolrSubmissionWithDate | ISolrFullSubmissionWithDate
interface IProps {
  className?: string
  currentSelectionCount?: number
  searchResultsCount?: number
  allSubmissions?: SolrSubmission[]
  shownSubmissions?: ISolrFullSubmissionWithDate[]
  searchInProgress?: boolean
  openModal?: (name: EModal, params?: any) => void
  toggleSelectShownSubmissions?: () => void
  selectAllSubmissions?: () => Promise<void>
  resetSelections?: () => void
}

export const FloatingMenu = inject((stores: Stores) => ({
  currentSelectionCount: stores.reviewStore.currentSelectionCount,
  searchResultsCount: stores.searchStore.searchResultsCount,
  shownSubmissionsCount: stores.searchStore.shownSubmissions.length,
  searchInProgress: stores.searchStore.searchInProgress,
  openModal: stores.modalStore.openModal,
  toggleSelectShownSubmissions: stores.reviewStore.toggleSelectShownSubmissions,
  selectAllSubmissions: stores.reviewStore.selectAllSubmissions,
  resetSelections: stores.reviewStore.resetSelections,
}))
(observer((props: IProps) => {
  const {
    className, currentSelectionCount, searchResultsCount, searchInProgress,
    openModal, toggleSelectShownSubmissions, selectAllSubmissions, resetSelections
  } = props
  function handleReviewClick() {
    openModal!(EModal.REVIEW_SUBMISSIONS)
  }
  function handleToggleShownClick() {
    toggleSelectShownSubmissions!()
  }
  function handleAddAllClick() {
    selectAllSubmissions!()
  }
  function handleTrashClick() {
    resetSelections!()
  }
  return (
    <Wrapper className={className}>
      <Container>
        <Header>
          { searchInProgress ? <Spinner /> : null }
          <Title>Selected: {currentSelectionCount}/{searchResultsCount}</Title>
        </Header>
        <Body>
          <Icon button onClick={handleReviewClick} title="Review selected" disabled={currentSelectionCount === 0}>
            <FiCheck size={18}/>
          </Icon>
          <Icon button onClick={handleToggleShownClick} title="Toggle all shown" disabled={searchResultsCount === 0}>
            <FiPlusSquare size={18}/>
          </Icon>
          <Icon button onClick={handleAddAllClick} title="Select all found" disabled={searchResultsCount === 0}>
            <FiFolderPlus size={18}/>
          </Icon>
          <Icon button onClick={handleTrashClick} title="Unselect all" disabled={currentSelectionCount === 0}>
            <FiTrash size={18}/>
          </Icon>
        </Body>
      </Container>
    </Wrapper>
  )
}))

const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`
const Title = styled.div`
  margin: 0;
`
const Wrapper = styled.div`
  bottom: 20px;
  right: 20px;
  position: fixed;
  z-index: 10;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.TABLET_WIDTH}) {
    bottom: 0;
    right: 0;
  }
`
const Container = styled.div`
  align-items: center;
  background: #fff;
  border: 1px solid #222;
  border-radius: 4px;
  box-shadow: 0 0 2px 2px rgba(0,0,0,0.18);
  color: #222;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
`
const Body = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 0.5rem;
  width: 100%;
  & > ${Icon}:not(:first-child) {
    margin-left: 0.5rem
  }
`
