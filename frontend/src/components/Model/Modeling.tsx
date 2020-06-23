import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'
import { FiTrash } from 'react-icons/fi'
import { MdKeyboardArrowRight } from 'react-icons/md'

import { ModelDescription } from './ModelDescription'
import { ModelParameters } from './ModelParameters'
import { ClusteringResults } from './ClusteringResults'
import { LocalSearchForm } from './LocalSearchForm'
import { Button } from '../../elements/Button'
import { Icon } from '../../elements/Icon'
import { Dropdown } from '../../elements/Dropdown'

import {
  IModel, IModelParams, IRunModelResponse, INgramParams
} from 'shared'
import { Stores } from '../../stores'

interface IProps {
  className?: string
  visible: boolean
  models?: IModel[]
  selectedModel?: IModel
  modelParameters?: {
    ngram: INgramParams
  }
  getModels?: () => Promise<IModel[] | undefined>
  setSelectedModel?: (title?: string) => void
  runModel?: (data: IModelParams) => Promise<any>
}

const ModelingEl = inject((stores: Stores) => ({
  models: stores.modelStore.models,
  selectedModel: stores.modelStore.selectedModel,
  modelParameters: stores.modelStore.modelParameters,
  getModels: stores.modelStore.getModels,
  setSelectedModel: stores.modelStore.setSelectedModel,
  runModel: stores.modelStore.runModel,
}))
(observer((props: IProps) => {
  const {
    className, visible, models, selectedModel, modelParameters, getModels, setSelectedModel, runModel
  } = props
  const [loading, setLoading] = useState(false)
  const [modelOptions, setModelOptions] = useState(models!.map(m => ({ key: m.model_id, value: m.title })))

  useEffect(() => {
    setLoading(true)
    getModels!().then((result) => {
      setLoading(false)
      if (result) {
        setModelOptions(result.map(m => ({ key: m.model_id, value: m.title })))
      }
    })
  }, [])

  function handleSelectModel(option: { key: string, value: string }) {
    setSelectedModel!(option.value)
  }
  function handleModelTrashClick() {
    setSelectedModel!()
  }
  function handleRunModel(data: IModelParams) {
    return runModel!(data)
  }
  function renderDropdownMenu(content: React.ReactNode) {
    return (
      <>
        <Icon><MdKeyboardArrowRight size={24}/></Icon>
        <DropdownText>{content}</DropdownText>
      </>
    )
  }
  return (
    <Container className={className} visible={visible}>
      <Body>
        <ModelControlsWrapper>
          <InfoText>
            Currently only N-gram model is supported.
          </InfoText>
          <DropdownField>
            <SelectModelDropdown
              selected={selectedModel?.model_id}
              options={modelOptions}
              placeholder="Select model"
              fullWidth
              renderMenu={renderDropdownMenu}
              onSelect={handleSelectModel}
            />
            <Icon button onClick={handleModelTrashClick}><FiTrash size={18}/></Icon>
          </DropdownField>
          <ModelDescription selectedModel={selectedModel}/>
          <ModelParameters
            selectedModel={selectedModel}
            modelParameters={modelParameters!}
            runModel={handleRunModel}
          />
        </ModelControlsWrapper>
        <LocalSearchForm />
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
const ModelControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 700px;
  width: 100%;
`
const InfoText = styled.p`
  margin: 1rem 0;
`
const DropdownField = styled.div`
  display: flex;
  margin: 0.75rem 0 0 0;
  max-width: 700px;
  width: 100%;
  & > ${Icon} {
    margin-left: 1rem;
  }
`
const DropdownText = styled.span`
  font-weight: bold;
  font-size: 1.5rem;
  margin: 0 1rem;
`
const SelectModelDropdown = styled(Dropdown)`
  & > button {
    background: ${({ theme }) => theme.color.green};
    border: 1px solid #222;
    border-radius: 4px;
    &:hover {
      background-color: #00c364; // rgba(0, 0, 0, 0.08);
    }
  }
`

export const Modeling = styled(ModelingEl)``
