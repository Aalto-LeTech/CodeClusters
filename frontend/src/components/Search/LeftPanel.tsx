import React, { memo, useState } from 'react'
import styled from 'styled-components'
import {
  FiLayers, FiAlignLeft, FiChevronDown, FiChevronUp, FiTrash
} from 'react-icons/fi'

import { FilterMenu } from '../FilterMenu'
import { Icon } from '../../elements/Icon'

interface IProps {
  className?: string
}

const LeftPanelEl = memo((props: IProps) => {
  const { className } = props
  const [filtersMinimized, setFiltersMinimized] = useState(false)
  const [modelsMinimized, setModelsMinimized] = useState(false)
  // 1-10	not much risk
  // 11-20	moderate risk
  // 21-50	high risk
  // 51+	untestable, very high risk
  const complexityOptions = [
    { name: '>50', value: 22 },
    { name: '50-21', value: 18 },
    { name: '20-11', value: 4 },
    { name: '10-1', value: 10 },
  ]
  const sizeOptions = [
    { name: '>100', value: 22 },
    { name: '80-40', value: 18 },
    { name: '40-20', value: 4 },
    { name: '20-10', value: 10 },
    { name: '<10', value: 50 },
  ]
  const ngramOptions = [
    { name: '(7,7)', value: 22 },
    { name: '(6,6)', value: 18 },
    { name: '(5,5)', value: 4 },
    { name: '(4,4)', value: 10 },
    { name: '(3,3)', value: 50 },
  ]
  function handleClickToggle(menu: 'filters' | 'models') {
    if (menu === 'filters') {
      setFiltersMinimized(!filtersMinimized)
    } else {
      setModelsMinimized(!modelsMinimized)
    }
  }
  return (
    <Container className={className}>
      <Menu>
        <MenuHeader>
          <Title>Filters</Title>
          <Icon button onClick={() => handleClickToggle('filters')}>
            { filtersMinimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
          </Icon>
        </MenuHeader>
        <MenuBody minimized={filtersMinimized}>
          <FilterMenu
            name="Cyclomatic complexity"
            placeholder="Filter by complexity"
            icon={<FiLayers size={18}/>}
            options={complexityOptions}
          />
          <FilterMenu
            name="Code size"
            placeholder="Filter by size"
            icon={<FiAlignLeft size={18}/>}
            options={sizeOptions}
          />
        </MenuBody>
      </Menu>
      <Menu>
        <MenuHeader>
          <Title>Models</Title>
          <Icon button onClick={() => handleClickToggle('models')}>
            { modelsMinimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
          </Icon>
        </MenuHeader>
        <MenuBody minimized={modelsMinimized}>
          <FilterMenu
            name="N-gram"
            placeholder="Used n-grams"
            icon={<FiLayers size={18}/>}
            options={ngramOptions}
          />
        </MenuBody>
      </Menu>
    </Container>
  )
})

const Container = styled.section`
  margin-left: 2rem;
`
const MenuHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const Title = styled.h3`
  margin: 0;
`
const Menu = styled.div`
  width: 212px;
  & > * {
    margin-bottom: 1rem;
  }
`
const MenuBody = styled.div<{ minimized: boolean}>`
  display: ${({ minimized }) => minimized ? 'none' : 'flex'};
  flex-direction: column;
  justify-content: space-around;
  margin-top: 1rem;
  visibility: ${({ minimized }) => minimized ? 'hidden' : 'initial'};
  width: 100%;
  & > *:not(:first-child) {
    margin-top: 1rem;
  }
`

export const LeftPanel = styled(LeftPanelEl)``
