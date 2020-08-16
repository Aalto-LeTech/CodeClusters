import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { ResultItem } from './ResultItem'
import { Pagination } from './Pagination'
import { LocalSearchControls } from './LocalSearchControls'

import { SelectItem } from '../../elements/SelectItem'

import { Stores } from '../../stores'
import { ISolrFullSubmissionWithDate } from 'shared'

interface IProps {
  className?: string
  localSearchActive?: boolean
  totalResultsCount?: number
  searchResultsStart?: number
  shownSubmissions?: ISolrFullSubmissionWithDate[]
  setLocalSearchActive?: (b: boolean) => void
}

const SearchResultsListEl = inject((stores: Stores) => ({
  localSearchActive: stores.localSearchStore.searchActive,
  totalResultsCount: stores.searchStore.searchResultsCount,
  searchResultsStart: stores.searchStore.searchResultsStart,
  shownSubmissions: stores.searchStore.shownSubmissions,
  setLocalSearchActive: stores.localSearchStore.setActive,
}))
(observer((props: IProps) => {
  const {
    className, localSearchActive, totalResultsCount, searchResultsStart = 0, shownSubmissions,
    setLocalSearchActive
  } = props
  const resultsCount = shownSubmissions!.length
  const resultsStart = resultsCount === 0 ? 0 : searchResultsStart + 1

  function handleToggleLocalSearch() {
    // lol
    setLocalSearchActive!(!!!localSearchActive)
  }
  return (
    <Container className={className}>
      <LocalSearchControls visible={localSearchActive!!} onClose={handleToggleLocalSearch}/>
      <ListHeader>
        <span>Showing {resultsStart}-{searchResultsStart + resultsCount} of {totalResultsCount} results</span>
        <Pagination/>
        <LocalSearchBox active={localSearchActive} onClick={handleToggleLocalSearch}>
          Modeling mode {localSearchActive ? 'active' : 'inactive'}
        </LocalSearchBox>
      </ListHeader>
      <ResultList>
        { shownSubmissions!.map((result) =>
        <SearchResultsListItem key={result.id}>
          <ResultItem result={result} />
        </SearchResultsListItem>  
        )}
      </ResultList>
      <Pagination/>
    </Container>
  )
}))

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  & > ${Pagination} {
    margin: 1rem 0;
  }
`
const ListHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 2rem 0 2rem 0;
  & > span:first-child {
    padding: 0.5rem 0;
  }
  & > .empty {
    width: 160px;
  }
`
const LocalSearchBox = styled.button<{ active?: boolean }>`
  background: ${({ active, theme }) => active ? theme.color.primary : theme.color.gray.base};
  border: 0;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:hover {
    background: ${({ active, theme }) => active ? theme.color.primaryLight : theme.color.gray.light};
  }
`
const ResultList = styled.ul`
`
const SearchResultsListItem = styled.li`
`

export const SearchResultsList = styled(SearchResultsListEl)``
