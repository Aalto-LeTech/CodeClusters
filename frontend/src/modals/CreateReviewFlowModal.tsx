import React, { useEffect, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'
import useScrollLock from '../hooks/useScrollLock'

import { CreateReviewFlowForm } from '../components/ReviewFlows/CreateReviewFlowForm'
import { SearchForm } from '../components/Search/SearchForm'
import { SelectModel } from '../components/Model/SelectModel'
import { AddReviewForm } from '../components/AddReviewForm'
import { Modal } from '../elements/Modal'
import { Button } from '../elements/Button'
import { Icon } from '../elements/Icon'

import {
  IReviewFlowCreateParams, IReviewFlowCreateFormParams, ISearchCodeParams, IModel, IModelParams,
  INgramParams, IReviewCreateFormParams
} from 'shared'
import { Stores } from '../stores'
import { IModal, EModal } from '../stores/ModalStore'

interface IFormRefMethods<T> {
  executeSubmit: () => Promise<T>
  reset: () => void
}
interface IProps {
  className?: string
  courseId?: number
  exerciseId?: number
  userId?: number
  searchParams?: ISearchCodeParams
  modal?: IModal
  models?: IModel[]
  selectedModel?: IModel
  modelParameters?: {
    ngram: INgramParams
  }
  setSelectedModel?: (model?: IModel) => void
  runModel?: (data: IModelParams) => Promise<any>
  addReviewFlow?: (payload: IReviewFlowCreateParams) => Promise<any>
  setToasterLocation?: (topRight?: boolean) => void
  closeModal?: () => void
}

export const CreateReviewFlowModal = inject((stores: Stores) => ({
  courseId: stores.courseStore.courseId,
  exerciseId: stores.courseStore.exerciseId,
  userId: stores.authStore.user?.user_id,
  searchParams: stores.searchStore.searchParams,
  modal: stores.modalStore.modals[EModal.CREATE_REVIEW_FLOW],
  models: stores.modelStore.models,
  selectedModel: stores.reviewFlowStore.newReviewFlowSelectedModel,
  modelParameters: stores.reviewFlowStore.newReviewFlowModelParameters,
  setSelectedModel: stores.reviewFlowStore.setSelectedNewReviewFlowModel,
  runModel: stores.modelStore.runModel,
  addReviewFlow: stores.reviewFlowStore.addReviewFlow,
  setToasterLocation: stores.toastStore.setToasterLocation,
  closeModal: () => stores.modalStore.closeModal(EModal.CREATE_REVIEW_FLOW),
}))
(observer((props: IProps) => {
  const {
    className, courseId, exerciseId, userId, searchParams, modal,
    models, selectedModel, modelParameters,
    setSelectedModel, runModel, addReviewFlow, setToasterLocation, closeModal
  } = props
  const [submitInProgress, setSubmitInProgress] = useState(false)

  function handleClose() {
    closeModal!()
  }
  function onCancel() {
    closeModal!()
  }
  function handleSearch(params: ISearchCodeParams) {
    return Promise.resolve()
  }
  function reset() {
    reviewFlowFormRef?.current?.reset()
    searchFormRef?.current?.reset()
    modelFormRef?.current?.reset()
    reviewFormRef?.current?.reset()
    setSelectedModel!()
  }
  async function handleReviewFlowSubmit() {
    try {
      const reviewFlowForm = await reviewFlowFormRef?.current?.executeSubmit()
      const searchFormData = await searchFormRef?.current?.executeSubmit()
      // Conditional incase no model selected, thus no validation/submit needed
      const modelFormData = selectedModel ? await modelFormRef?.current?.executeSubmit() : undefined
      const reviewFormData = await reviewFormRef?.current?.executeSubmit()
      if (reviewFlowForm && searchFormData && reviewFormData) {
        const payload: IReviewFlowCreateParams = {
          ...reviewFlowForm,
          user_id: userId ? userId : 0,
          steps: [{
            index: 0,
            action: 'Search',
            data: searchFormData
          }]
        }
        if (modelFormData) {
          payload.steps.push({
            index: payload.steps.length,
            action: 'Model',
            data: modelFormData
          })
        }
        payload.steps.push({
          index: payload.steps.length,
          action: 'Review',
          data: reviewFormData
        })
        setSubmitInProgress(true)
        const result = await addReviewFlow!(payload)
        if (result) {
          reset()
          setSubmitInProgress(false)
          closeModal!()
        } else {
          setSubmitInProgress(false)
        }
      }
    } catch (err) {
      setSubmitInProgress(false)
    }
  }
  useEffect(() => {
    if (modal!.isOpen) {
      setToasterLocation!(true)
    } else {
      setToasterLocation!(false)
    }
  }, [modal!.isOpen])
  const reviewFlowFormRef = useRef<IFormRefMethods<IReviewFlowCreateFormParams>>(null)
  const searchFormRef = useRef<IFormRefMethods<ISearchCodeParams>>(null)
  const modelFormRef = useRef<IFormRefMethods<IModelParams>>(null)
  const reviewFormRef = useRef<IFormRefMethods<IReviewCreateFormParams>>(null)
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
          <ReviewFlowParams>
            <CreateReviewFlowForm ref={reviewFlowFormRef}/>
          </ReviewFlowParams>
          <Divider />
          <SearchParams>
            <SearchHeader>
              <Title>Search</Title>
              <div><Button>Use current search</Button></div>
            </SearchHeader>
            <SearchForm
              ref={searchFormRef}
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
              ref={modelFormRef}
              id="new_reviewflow"
              models={models}
              selectedModel={selectedModel}
              initialModelParameters={modelParameters}
              setSelectedModel={setSelectedModel}
            />
          </ModelParams>
          <Divider />
          <ReviewParams>
            <ReviewHeader>
              <Title>Review</Title>
              <div></div>
            </ReviewHeader>
            <AddReviewForm ref={reviewFormRef}/>
          </ReviewParams>
          <ButtonControls>
            <Button
              type="submit"
              intent="success"
              disabled={submitInProgress}
              loading={submitInProgress}
              onClick={handleReviewFlowSubmit}
            >Submit</Button>
            <Button intent="info">Test flow</Button>
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
  max-width: 800px;
  padding: 20px;
  position: absolute;
  top: 10px;
  width: calc(100% - 20px - 2rem);
  /* @media only screen and (max-width: ${({ theme }) => theme.breakpoints.DEFAULT_WIDTH}) {
    max-width: 800px;
  } */
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
const ReviewFlowParams = styled.div`
  margin: 1rem 0;
  max-width: 700px;
  width: 100%;
`
const SearchParams = styled.div`
  max-width: 700px;
  margin-bottom: 0.5rem;
  width: 100%;
`
const SearchHeader = styled.div`
  align-items: center;
  display: flex;
  margin: 0.5rem 0 1rem 0;
  & > *:first-child {
    margin: 0 2rem 0 0;
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
  margin: 0.5rem 0;
  & > *:first-child {
    margin: 0 2rem 0 0;
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
  margin-top: 2rem;
  width: 100%;
  & > * + * {
    margin-left: 1rem;
  }
`
