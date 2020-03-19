import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { ResultItem } from './ResultItem'
import { Pagination } from './Pagination'

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
  return (
    <Container className={className}>
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
  width: 100%;
`
const ResultList = styled.ul`
`
const SearchResultsListItem = styled.li`
`

export const SearchResultsList = styled(SearchResultsListEl)``
