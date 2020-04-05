import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'

import { MdKeyboardArrowRight } from 'react-icons/md'
import { FiTrash } from 'react-icons/fi'

import { Icon } from '../../elements/Icon'
import { Dropdown } from '../../elements/Dropdown'

import { Stores } from '../../stores'
import { ModelStore } from '../../stores/ModelStore'
import { SearchStore } from '../../stores/SearchStore'

interface IProps {
  className?: string
  modelStore?: ModelStore
  searchStore?: SearchStore
}

const SelectModelEl = inject((stores: Stores) => ({
  modelStore: stores.modelStore,
  searchStore: stores.searchStore,
}))
(observer((props: IProps) => {
  const {
    className, modelStore, searchStore
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
    <Container className={className}>
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
    </Container>
  )
}))

const Container = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 1rem 1rem 0 1rem;
`
const InfoText = styled.p`
  margin: 0 0 1rem 1rem;
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
