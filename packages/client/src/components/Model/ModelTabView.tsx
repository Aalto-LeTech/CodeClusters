import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { SelectModel } from './SelectModel'
import { ClusteringResults } from './ClusteringResults'
import { LocalSearchForm } from '../Search/LocalSearchForm'

import {
  IModel, IModelId, IModelParams, INgramParams
} from '@codeclusters/types'
import { ModelFormParams } from '../../types/forms'
import { Stores } from '../../stores'

interface IProps {
  className?: string
  visible: boolean
  models?: IModel[]
  selectedModel?: IModel
  initialModelData?: {
    ngram: INgramParams
  }
  getModels?: () => Promise<IModel[] | undefined>
  setSelectedModel?: (model?: IModel) => void
  updateModelFormData?: (modelId: IModelId, formData: ModelFormParams) => void
  runModel?: (data: IModelParams) => Promise<any>
}

const ModelTabViewEl = inject((stores: Stores) => ({
  models: stores.modelStore.models,
  selectedModel: stores.modelStore.selectedModel,
  initialModelData: stores.modelStore.initialModelData,
  getModels: stores.modelStore.getModels,
  setSelectedModel: stores.modelStore.setSelectedModel,
  updateModelFormData: stores.modelStore.updateModelFormData,
  runModel: stores.modelStore.runModel,
}))
(observer((props: IProps) => {
  const {
    className, visible, models, selectedModel, initialModelData,
    getModels, setSelectedModel, updateModelFormData, runModel
  } = props
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getModels!().then((result) => {
      setLoading(false)
    })
  }, [])

  function handleModelFormDataChange(formData: ModelFormParams) {
    updateModelFormData!(selectedModel?.model_id!, formData)
  }

  return (
    <Container className={className} visible={visible}>
      <Body>
        <SelectModel
          id="modeltab"
          models={models}
          selectedModel={selectedModel}
          initialModelData={initialModelData!}
          setSelectedModel={setSelectedModel}
          onModelFormChange={handleModelFormDataChange}
          onModelSubmit={runModel}
        />
        <ClusteringResults />
      </Body>
    </Container>
  )
}))

const Container = styled.section<{ visible: boolean}>`
  align-items: center;
  display: ${({ visible }) => visible ? 'flex' : 'none'};
  flex-direction: column;
  margin: 1rem;
  margin-top: 0;
  visibility: ${({ visible }) => visible ? 'initial' : 'hidden'};
`
const Body = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-top: 0;
  padding: 1rem;
  width: 100%;
`

export const ModelTabView = styled(ModelTabViewEl)``
