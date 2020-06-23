import React, { useRef } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'
import useScrollLock from '../hooks/useScrollLock'

import { SearchForm } from '../components/SearchPage/SearchForm'
import { AddReviewForm, IAddReviewFormParams } from '../components/AddReviewForm'
import { Modal } from '../elements/Modal'
import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'

import { IReviewCreateParams, ISearchCodeParams } from 'shared'
import { Stores } from '../stores'
import { IModal, EModal } from '../stores/ModalStore'

interface IProps {
  className?: string
  courseId?: number
  exerciseId?: number
  searchParams?: ISearchCodeParams
  modal?: IModal
  closeModal?: () => void
  addReview?: (message: string, metadata: string) => Promise<any>
  resetSelections?: () => void
}

export const CreateReviewFlowModal = inject((stores: Stores) => ({
  courseId: stores.courseStore.courseId,
  exerciseId: stores.courseStore.exerciseId,
  searchParams: stores.searchStore.searchParams,
  modal: stores.modalStore.modals[EModal.CREATE_REVIEW_FLOW],
  closeModal: () => stores.modalStore.closeModal(EModal.CREATE_REVIEW_FLOW),
  addReview: stores.reviewStore.addReview,
  resetSelections: stores.reviewStore.resetSelections,
}))
(observer((props: IProps) => {
  const {
    className, courseId, exerciseId, searchParams, modal,
    closeModal, addReview, resetSelections
  } = props
  function handleClose() {
    closeModal!()
  }
  function onAccept() {
    modal!.params?.submit()
    closeModal!()
  }
  function onCancel() {
    closeModal!()
  }
  function handleSearch(params: ISearchCodeParams) {
    console.log(params)
    return Promise.resolve()
  }
  async function handleReviewSubmit(payload: IAddReviewFormParams, onSuccess: () => void, onError: () => void) {
    const result = await addReview!(payload.message, payload.metadata)
    if (result) {
      onSuccess()
      resetSelections!()
      closeModal!()
    } else {
      onError()
    }
  }
  const ref = useRef(null)
  useClickOutside(ref, (e) => handleClose(), modal!.isOpen)
  useScrollLock(modal!.isOpen)
  return (
    <Modal className={className}
      isOpen={modal!.isOpen}
      body={
        <Body ref={ref}>
          <Header>
            <TitleWrapper><h2>Create new review flow</h2></TitleWrapper>
            <Icon button onClick={handleClose}><FiX size={24}/></Icon>
          </Header>
          <SearchParams>
            <SearchHeader>
              <Title>Search</Title>
              <div><Button>Use current search</Button></div>
            </SearchHeader>
            <SearchForm
              id="reviewflow_search"
              visible={true}
              courseId={courseId}
              exerciseId={exerciseId}
              onSearch={handleSearch}
            />
          </SearchParams>
          <ModelParams>
            <ModelHeader>
              <Title>Model</Title>
              <div><Button>Use current model</Button></div>
            </ModelHeader>
          </ModelParams>
          <AddReviewForm
            onSubmit={handleReviewSubmit}
            onCancel={handleClose}
          />
        </Body>
      }
    ></Modal>
  )
}))

const Body = styled.div`
  align-items: center;
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 1200px;
  padding: 20px;
  position: absolute;
  top: 0;
  width: calc(100% - 20px - 2rem);
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.DEFAULT_WIDTH}) {
    max-width: 800px;
  }
  .close-icon {
    align-self: flex-end;
    position: relative;
    right: -5px; // Move the icon a little closer the border than the 20px padding allows to look nicer
    top: -5px;
  }
`
const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const TitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-left: 40px;
  width: 100%;
  & > h2 {
    font-size: 20px;
    font-weight: 500;
    margin: 0;
    padding: 0;
  }
`
const Title = styled.h3``
const SearchParams = styled.div`
`
const SearchHeader = styled.div`
  align-items: center;
  display: flex;
  & > *:first-child {
    margin-right: 2rem;
  }
`
const ModelParams = styled.div`
`
const ModelHeader = styled.div`
  align-items: center;
  display: flex;
  & > *:first-child {
    margin-right: 2rem;
  }
`
const Buttons = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  & > *:first-child {
    margin-right: 1rem;
  }
`
