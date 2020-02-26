import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { Button } from '../../elements/Button'
import { SelectItem } from '../../elements/SelectItem'

import { SearchStore } from '../../stores/SearchStore'
import { ISearchResult } from 'shared'

interface IProps {
  className?: string
  searchStore?: SearchStore
}

const SearchResultsListEl = inject('searchStore')(observer((props: IProps) => {
  const { className, searchStore } = props
  const resultsCount = searchStore!.searchResults.length
  function handleResultClick(id: number) {

  }
  return (
    <Container>
      { resultsCount !== 0 && <p>Showing {resultsCount} results</p> }
      <ResultList className={className}>
        { searchStore!.searchResults.map((result) =>
          <SearchResultsListItem key={result.id} onClick={() => handleResultClick(result.id)}>
            <p>Student id: {result.student_id}</p>
            <p>{result.date.toISOString()}</p>
            <pre className="code">{result.code}</pre>
            <div className="controls">
            </div>
          </SearchResultsListItem>  
        )}
      </ResultList>
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
