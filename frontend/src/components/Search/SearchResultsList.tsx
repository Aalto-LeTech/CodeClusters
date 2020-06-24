import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { ResultItem } from './ResultItem'
import { Pagination } from './Pagination'

import { SelectItem } from '../../elements/SelectItem'

import { Stores } from '../../stores'
import { ISolrFullSubmissionWithDate } from 'shared'

interface IProps {
  className?: string
  localSearchActive?: boolean
  totalResultsCount?: number
  shownSubmissions?: ISolrFullSubmissionWithDate[]
}

const SearchResultsListEl = inject((stores: Stores) => {
  const localSearchActive = stores.localSearchStore.active
  const ls = stores.localSearchStore
  const s = stores.searchStore
  return {
    localSearchActive: stores.localSearchStore.active,
    totalResultsCount: localSearchActive ? ls.foundSubmissionsIndexes.length : s.selectedSearchResult.numFound || 0,
    shownSubmissions: localSearchActive ? ls.shownSubmissions : s.selectedSearchResult.docs
  }
})
(observer((props: IProps) => {
  const { className, localSearchActive, totalResultsCount, shownSubmissions } = props
  const resultsCount = shownSubmissions!.length
  return (
    <Container className={className}>
      <ListHeader>
        <span>Showing {resultsCount} of {totalResultsCount} results</span>
        { localSearchActive && <LocalSearchBox>Local search active</LocalSearchBox>}
      </ListHeader>
      <Pagination pages={10}/>
      <ResultList className={className}>
        { shownSubmissions!.map((result) =>
        <SearchResultsListItem key={result.id}>
          <ResultItem result={result} />
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
const ListHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  & > span:first-child {
    padding: 0.5rem 0;
  }
`
const LocalSearchBox = styled.span`
  background: ${({ theme }) => theme.color.primary};
  border-radius: 4px;
  color: #fff;
  padding: 0.5rem 1.5rem;
`
const ResultList = styled.ul`
`
const SearchResultsListItem = styled.li`
`

export const SearchResultsList = styled(SearchResultsListEl)``
