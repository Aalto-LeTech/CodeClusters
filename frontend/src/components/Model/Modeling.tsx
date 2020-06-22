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

import { ModelStore } from '../../stores/ModelStore'

interface IProps {
  className?: string
  visible: boolean
  modelStore?: ModelStore
}

const ModelingEl = inject('modelStore')(observer((props: IProps) => {
  const {
    className, visible, modelStore
  } = props
  const [loading, setLoading] = useState(false)
  const modelOptions = modelStore!.models.map(m => ({ key: m.model_id, value: m.title }))

  useEffect(() => {
    setLoading(true)
    modelStore!.getModels().then((models) => {
      setLoading(false)
    })
  }, [])

  function handleSelectModel(option: { key: string, value: string }) {
    modelStore!.setSelectedModel(option.value)
  }
  function handleModelTrashClick() {
    modelStore!.setSelectedModel()
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
              selected={modelStore!.selectedModel?.model_id}
              options={modelOptions}
              placeholder="Select model"
              fullWidth
              renderMenu={renderDropdownMenu}
              onSelect={handleSelectModel}
            />
            <Icon button onClick={handleModelTrashClick}><FiTrash size={18}/></Icon>
          </DropdownField>
          <ModelDescription />
          <ModelParameters />
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
