import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { ResultItem } from './ResultItem'
import { Pagination } from './Pagination'

import { Button } from '../../elements/Button'
import { SelectItem } from '../../elements/SelectItem'

import { SearchStore } from '../../stores/SearchStore'

interface IProps {
  className?: string
  searchStore?: SearchStore
}

const SearchResultsListEl = inject('searchStore')(observer((props: IProps) => {
  const { className, searchStore } = props
  const resultsCount = searchStore!.searchResult.docs.length
  const totalCount = searchStore!.searchResult.numFound || 0
  function handleResultClick(id: number) {

  }
  return (
    <Container>
      { resultsCount !== 0 && <p>Showing {resultsCount} of {totalCount} results</p> }
      <Pagination pages={10}/>
      <ResultList className={className}>
        { searchStore!.searchResult.docs.map((result) =>
          <SearchResultsListItem key={result.id}>
            <ResultItem result={result} latestQuery={searchStore!.latestQuery}/>
          </SearchResultsListItem>  
        )}
      </ResultList>
      <Pagination pages={10}/>
    </Container>
  )
}))

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const ResultList = styled.ul`
`
const SearchResultsListItem = styled.li`
  background: #ededed;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  margin: 0 0 10px 0;
  padding: 1rem;
  & > p {
    margin: 0 10px 0 0;
  }
  .code {
    background: #222;
    color: #fff;
    padding: 10px;
    border-radius: 0.25rem;
  }
  .message {
    background: rgba(255, 0, 0, 0.4);
    padding: 1rem;
    border-radius: 0.25rem;
  }
  .controls {
    margin-top: 1rem;
  }
`

export const SearchResultsList = styled(SearchResultsListEl)``
