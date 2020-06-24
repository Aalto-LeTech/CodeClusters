import React, { useRef } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'
import useScrollLock from '../hooks/useScrollLock'

import { SearchForm } from '../components/SearchPage/SearchForm'
import { SelectModel } from '../components/Model/SelectModel'
import { AddReviewForm, IAddReviewFormParams } from '../components/AddReviewForm'
import { Modal } from '../elements/Modal'
import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'

import { IReviewCreateParams, ISearchCodeParams, IModel, IModelParams, INgramParams } from 'shared'
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
  models?: IModel[]
  selectedModel?: IModel
  modelParameters?: {
    ngram: INgramParams
  }
  setSelectedModel?: (model?: IModel) => void
  runModel?: (data: IModelParams) => Promise<any>
}

export const CreateReviewFlowModal = inject((stores: Stores) => ({
  courseId: stores.courseStore.courseId,
  exerciseId: stores.courseStore.exerciseId,
  searchParams: stores.searchStore.searchParams,
  modal: stores.modalStore.modals[EModal.CREATE_REVIEW_FLOW],
  closeModal: () => stores.modalStore.closeModal(EModal.CREATE_REVIEW_FLOW),
  addReview: stores.reviewStore.addReview,
  resetSelections: stores.reviewStore.resetSelections,
  models: stores.modelStore.models,
  selectedModel: stores.reviewFlowStore.newReviewFlowSelectedModel,
  modelParameters: stores.reviewFlowStore.newReviewFlowModelParameters,
  setSelectedModel: stores.reviewFlowStore.setSelectedNewReviewFlowModel,
  runModel: stores.modelStore.runModel,
}))
(observer((props: IProps) => {
  const {
    className, courseId, exerciseId, searchParams, modal,
    models, selectedModel, modelParameters, setSelectedModel, runModel,
    closeModal, addReview, resetSelections,
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
  function handleReviewFlowSubmit() {

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
          <Divider />
          <SearchParams>
            <SearchHeader>
              <Title>Search</Title>
              <div><Button>Use current search</Button></div>
            </SearchHeader>
            <SearchForm
              id="reviewflow_search"
              courseId={courseId}
              exerciseId={exerciseId}
              onSearch={handleSearch}
            />
          </SearchParams>
          <Divider />
          <ModelParams>
            <ModelHeader>
              <Title>Model</Title>
              <div><Button>Use current model</Button></div>
            </ModelHeader>
            <SelectModel
              models={models}
              selectedModel={selectedModel}
              modelParameters={modelParameters}
              setSelectedModel={setSelectedModel}
              runModel={runModel}
            />
          </ModelParams>
          <Divider />
          <ReviewParams>
            <ReviewHeader>
              <Title>Review</Title>
              <div></div>
            </ReviewHeader>
            <AddReviewForm
              onSubmit={handleReviewSubmit}
              onCancel={handleClose}
            />
          </ReviewParams>
          <ButtonControls>
            <Button intent="success" onClick={handleReviewFlowSubmit}>Create</Button>
            <Button intent="transparent" onClick={onCancel}>Cancel</Button>
          </ButtonControls>
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
const Divider = styled.hr`
  border: 0;
  border-bottom: 1px solid #222;
  margin: 1rem 0;
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
const Title = styled.h3`
  margin: 0.5rem 0 1rem 0;
`
const SearchParams = styled.div`
  max-width: 700px;
  margin-bottom: 0.5rem;
  width: 100%;
`
const SearchHeader = styled.div`
  align-items: center;
  display: flex;
  & > *:first-child {
    margin-right: 2rem;
  }
`
const ModelParams = styled.div`
  max-width: 700px;
  margin-bottom: 1rem;
  width: 100%;
`
const ModelHeader = styled.div`
  align-items: center;
  display: flex;
  & > *:first-child {
    margin-right: 2rem;
  }
`
const ReviewParams = styled.div`
  max-width: 700px;
  width: 100%;
`
const ReviewHeader = styled.div`
  align-items: center;
  display: flex;
`
const ButtonControls = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  & > * + * {
    margin-left: 1rem;
  }
`
