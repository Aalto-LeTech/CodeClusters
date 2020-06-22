import React, { memo, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { SearchConsole } from './SearchConsole'
import { ReviewFlows } from '../ReviewFlows'
import { Modeling } from '../Model'

import { Stores } from '../../stores'

interface IProps {
  className?: string
}

const SearchFlowsModelTabsMenuEl = inject((stores: Stores) => ({
}))
(observer((props: IProps) => {
  const { className } = props
  const options = [
    {
      key: 'search',
      value: 'Search'
    },
    {
      key: 'review_flows',
      value: 'Review flows'
    },
    {
      key: 'model',
      value: 'Model'
    }
  ]
  const [selectedIdx, setSelectedIdx] = useState(0)
  function onSelectOption(idx: number) {
    setSelectedIdx(idx)
  }
  return (
    <Container className={className}>
      <TabList>
        { options.map((o, i) =>
        <TabListItem key={o.key} selected={selectedIdx === i}>
          <TabButton onClick={() => onSelectOption(i)}>{o.value}</TabButton>
        </TabListItem>
        )}
      </TabList>
      <ShownView>
        <SearchConsole visible={options[selectedIdx].key === 'search'}/>
        <ReviewFlows visible={options[selectedIdx].key === 'review_flows'}/>
        <Modeling visible={options[selectedIdx].key === 'model'}/>
      </ShownView>
    </Container>
  )
}))

const Container = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 1rem;
`
const TabList = styled.ul`
  /* border-bottom: 1px solid ${({ theme }) => theme.color.gray.lighter}; */
  display: flex;
  list-style: none;
  margin: 0 15px;
  max-width: 700px;
  padding: 0;
  width: 100%;
`
const TabListItem = styled.li<{ disabled?: boolean, selected: boolean }>`
  background: ${({ selected, theme }) => selected ? theme.color.white : 'transparent'};
  border-radius: 4px 4px 0 0;
  box-shadow: ${({ selected, theme }) => selected && '0 0 2px 2px rgba(0,0,0,0.18)'};
  clip-path: inset(-5px -5px 0 -5px);
  color: ${({ selected, theme }) => selected ? theme.color.textDark : theme.color.textLight};
  display: flex;
  font-weight: ${({ selected }) => selected ? 'bold' : 400};
  margin-right: 15px;
  &:hover {
    border-color: ${({ disabled, theme }) => !disabled && theme.color.blue};
    box-shadow: ${({ disabled, theme }) => !disabled && '0 0 2px 2px rgba(0,0,0,0.18)'};
    clip-path: inset(-5px -5px 0 -5px);
    color: ${({ disabled, theme }) => !disabled && theme.color.textDark};
    font-weight: ${({ disabled }) => !disabled && 'bold'};
  }
`
const TabButton = styled.button<{ disabled?: boolean }>`
  background: transparent;
  border: 0;
  cursor: ${({ disabled }) => disabled ? 'cursor' : 'pointer'};
  font-size: 18px;
  padding: 0.75rem 1.25rem;
  text-transform: uppercase;
  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.gray.base};
    outline-style: dotted;
    outline-offset: 2px;
  }
`
const ShownView = styled.div`
  & > * {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 2px 2px rgba(0,0,0,0.18);
    &:first-child {
      border-radius: 0 4px 4px 4px;
    }
  }
`

export const SearchFlowsModelTabsMenu = styled(SearchFlowsModelTabsMenuEl)``
