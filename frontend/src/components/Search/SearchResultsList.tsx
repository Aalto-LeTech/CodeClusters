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
  shownSubmissions?: ISolrFullSubmissionWithDate[]
}

const SearchResultsListEl = inject((stores: Stores) => ({
  localSearchActive: stores.localSearchStore.searchActive,
  totalResultsCount: stores.searchStore.searchResultsCount,
  shownSubmissions: stores.searchStore.shownSubmissions
}))
(observer((props: IProps) => {
  const { className, localSearchActive, totalResultsCount, shownSubmissions } = props
  const resultsCount = shownSubmissions!.length
  return (
    <Container className={className}>
      <LocalSearchControls visible={localSearchActive!!}/>
      <ListHeader>
        <span>Showing {resultsCount} of {totalResultsCount} results</span>
        <Pagination/>
        { localSearchActive ?
        <LocalSearchBox>Modeling mode active</LocalSearchBox> :
        <div className="empty"></div>}
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
  margin: 1rem 0;
  & > span:first-child {
    padding: 0.5rem 0;
  }
  & > .empty {
    width: 160px;
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
