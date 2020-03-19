import React, { memo, useState } from 'react'
import styled from 'styled-components'
import { FiLayers, FiAlignLeft } from 'react-icons/fi'

import { SearchConsole } from './SearchConsole'
import { SearchResultsList } from './SearchResultsList'
import { FilterMenu } from '../FilterMenu'

interface IProps {
  className?: string
}

const SearchViewEl = memo((props: IProps) => {
  const { className } = props
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
  return (
    <Container className={className}>
      <SearchConsole />
      <Body>
        <LeftPanel>
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
        </LeftPanel>
        <SearchResultsList />
      </Body>
    </Container>
  )
})

const Container = styled.section``
const Body = styled.div`
  display: flex;
  & > ${SearchResultsList} {
    margin: 0 2rem;
  }
`
const LeftPanel = styled.div`
  max-width: 285px;
  margin-left: 2rem;
  & > * {
    margin-bottom: 1rem;
  }
`

export const SearchView = styled(SearchViewEl)``
