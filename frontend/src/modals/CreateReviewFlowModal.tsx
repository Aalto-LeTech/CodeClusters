import React, { useCallback, useEffect, useRef, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'
import useScrollLock from '../hooks/useScrollLock'

import { SelectCourseExercise } from '../components/SelectCourseExercise'
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
import { INgramFormParams, ModelFormParams } from '../types/forms'
import { Stores } from '../stores'
import { IModal, EModal } from '../stores/ModalStore'

interface IFormRefMethods<T> {
  executeSubmit: (defaultData?: any) => Promise<T>
  reset: (formData?: any) => void
}
interface IProps {
  className?: string
  courseId?: number
  exerciseId?: number
  userId?: number
  searchParameters?: ISearchCodeParams
  modal?: IModal
  models?: IModel[]
  selectedModel?: IModel
  modelFormData?: {
    ngram: INgramFormParams
  }
  newReviewFlowSelectedModel?: IModel
  newReviewFlowInitialModelData?: {
    ngram: INgramParams
  }
  setSelectedModel?: (model?: IModel) => void
  runModel?: (data: IModelParams) => Promise<any>
  addReviewFlow?: (payload: IReviewFlowCreateParams) => Promise<any>
  setToasterLocation?: (topRight?: boolean) => void
  closeModal?: (modal: EModal) => void
}

export const CreateReviewFlowModal = inject((stores: Stores) => ({
  courseId: stores.courseStore.courseId,
  exerciseId: stores.courseStore.exerciseId,
  userId: stores.authStore.user?.user_id,
  modal: stores.modalStore.modals[EModal.CREATE_REVIEW_FLOW],
  models: stores.modelStore.models,
  searchParameters: stores.searchStore.searchParams,
  selectedModel: stores.modelStore.selectedModel,
  modelFormData: stores.modelStore.modelFormData,
  newReviewFlowSelectedModel: stores.reviewFlowStore.newReviewFlowSelectedModel,
  newReviewFlowInitialModelData: stores.reviewFlowStore.newReviewFlowInitialModelData,
  setSelectedModel: stores.reviewFlowStore.setSelectedNewReviewFlowModel,
  runModel: stores.modelStore.runModel,
  addReviewFlow: stores.reviewFlowStore.addReviewFlow,
  setToasterLocation: stores.toastStore.setToasterLocation,
  closeModal: stores.modalStore.closeModal,
}))
(observer((props: IProps) => {
  const {
    className, courseId, exerciseId, userId, searchParameters, modal,
    models, selectedModel, modelFormData, newReviewFlowSelectedModel, newReviewFlowInitialModelData,
    setSelectedModel, runModel, addReviewFlow, setToasterLocation, closeModal
  } = props
  const [submitInProgress, setSubmitInProgress] = useState(false)

  function onCancel() {
    closeModal!(EModal.CREATE_REVIEW_FLOW)
  }
  function handleSearch(params: ISearchCodeParams) {
    return Promise.resolve()
  }
  function handleUseCurrentSearch() {
    searchFormRef?.current?.executeSubmit(searchParameters)
  }
  function handleUseCurrentModel() {
    if (selectedModel) {
      modelFormRef?.current?.reset(modelFormData![selectedModel?.model_id])
      setSelectedModel!(selectedModel)
    }
  }
  function resetSearch() {
    searchFormRef?.current?.reset()
  }
  function resetModel() {
    modelFormRef?.current?.reset()
    setSelectedModel!()
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
      const modelFormData = newReviewFlowSelectedModel ? await modelFormRef?.current?.executeSubmit() : undefined
      const reviewFormData = await reviewFormRef?.current?.executeSubmit()
      if (reviewFlowForm && searchFormData && reviewFormData) {
        const payload: IReviewFlowCreateParams = {
          ...reviewFlowForm,
          course_id: courseId,
          exercise_id: exerciseId,
          user_id: userId!,
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
          handleClose()
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
  const handleClose = useCallback(() => {
    closeModal!(EModal.CREATE_REVIEW_FLOW)
  }, [])
  useClickOutside(ref, handleClose, modal!.isOpen)
  useScrollLock(modal!.isOpen)
  return (
    <Modal className={className}
      isOpen={modal!.isOpen}
      body={
        <Body ref={ref}>
          <Header>
            <ModalTitleWrapper><h2>Create new review flow</h2></ModalTitleWrapper>
            <Icon button onClick={handleClose}><FiX size={24}/></Icon>
          </Header>
          <ReviewFlowParams>
            <CreateReviewFlowForm ref={reviewFlowFormRef}/>
          </ReviewFlowParams>
          <Divider />
          <SelectCourseExerciseContainer>
            <ParamsHeader>
              <Title>Select optional course and exercise</Title>
              <div></div>
            </ParamsHeader>
            <p>Select optional course and exercise for which this flow is intended.</p>
            <SelectCourseExercise />
          </SelectCourseExerciseContainer>
          <Divider />
          <SearchParams>
            <SearchHeader>
              <Title>Search</Title>
              <ParamsHeaderButtons>
                <Button onClick={handleUseCurrentSearch}>Use current search</Button>
                <Button intent="transparent" onClick={resetSearch}>Reset</Button>
              </ParamsHeaderButtons>
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
              <ParamsHeaderButtons>
                <Button onClick={handleUseCurrentModel}>Use current model</Button>
                <Button intent="transparent" onClick={resetModel}>Reset</Button>
              </ParamsHeaderButtons>
            </ModelHeader>
            <SelectModel
              ref={modelFormRef}
              id="new_reviewflow"
              models={models}
              selectedModel={newReviewFlowSelectedModel}
              initialModelData={newReviewFlowInitialModelData!}
              setSelectedModel={setSelectedModel}
            />
          </ModelParams>
          <Divider />
          <ReviewParams>
            <ParamsHeader>
              <Title>Review</Title>
              <div></div>
            </ParamsHeader>
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
const ModalTitleWrapper = styled.div`
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
const SelectCourseExerciseContainer = styled.div`
  margin: 0 0 1rem 0;
  max-width: 700px;
  width: 100%;
  & > p {
    margin: 1rem 0 2rem 0;
  }
  & > ${SelectCourseExercise} {
    align-items: flex-start;
  }
`
const Title = styled.h3`
  margin: 0.5rem 0 1rem 0;
`
const ParamsHeaderButtons = styled.div`
  align-items: center;
  display: flex;
  & > * + * {
    margin-left: 1rem;
  }
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
const ParamsHeader = styled.div`
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
