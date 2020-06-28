import React, { forwardRef, useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'
import { FiTrash } from 'react-icons/fi'
import { MdKeyboardArrowRight } from 'react-icons/md'

import { ModelDescription } from './ModelDescription'
import { ModelParameters } from './ModelParameters'
import { Icon } from '../../elements/Icon'
import { Dropdown } from '../../elements/Dropdown'

import { IModel, IModelParams, INgramParams } from 'shared'
import { ModelFormParams } from '../../types/forms'

interface IProps {
  className?: string
  id: string
  models?: IModel[]
  selectedModel?: IModel
  initialModelData: {
    ngram: INgramParams
  }
  setSelectedModel?: (model?: IModel) => void
  onModelFormChange?: (formData: ModelFormParams) => void
  onModelSubmit?: (data: IModelParams) => Promise<any>
}

const SelectModelEl = observer(forwardRef((props: IProps, ref) => {
  const {
    className, id, models, selectedModel, initialModelData, setSelectedModel, onModelFormChange, onModelSubmit
  } = props
  const [modelOptions, setModelOptions] = useState(models!.map(m => ({ key: m.model_id, value: m.title })))

  useEffect(() => {
    setModelOptions(models!.map(m => ({ key: m.model_id, value: m.title })))
  }, [models])

  function handleSelectModel(option: { key: string, value: string }) {
    setSelectedModel!(models?.find(m => m.title === option.value))
  }
  function handleModelTrashClick() {
    setSelectedModel!()
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
    <Container className={className} id={`${id}_select_model`}>
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
        ref={ref}
        id={id}
        selectedModel={selectedModel}
        initialModelData={initialModelData}
        onModelFormChange={onModelFormChange}
        onModelSubmit={onModelSubmit}
      />
    </Container>
  )
}))

const Container = styled.div`
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

export const SelectModel = styled(SelectModelEl)``
