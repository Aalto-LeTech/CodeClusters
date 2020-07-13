import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { SearchFacetGroupList } from './SearchFacetGroupList'

import { IProgrammingLanguageFacets, ISearchFacetParams } from 'shared'
import { Stores } from '../../stores'

interface IProps {
  className?: string
  currentSearchFacets?: IProgrammingLanguageFacets | undefined
  currentMetricsFacets?: { key: string, value: string }[]
  currentTokensFacets?: { key: string, value: string }[]
  facetParams?: { [facet: string] : ISearchFacetParams }
  facetCounts?: { [facet: string] : { value: string, count: number }[] }
  toggleSearchFacet?: (facet: string) => void
}

const SearchFiltersEl = inject((stores: Stores) => ({
  currentSearchFacets: stores.searchStore.currentSearchFacets,
  currentMetricsFacets: stores.searchStore.currentMetricsFacets,
  currentTokensFacets: stores.searchStore.currentTokensFacets,
  facetParams: stores.searchStore.currentFacetParams,
  facetCounts: stores.searchStore.selectedSearchResult.facetCounts,
  toggleSearchFacet: stores.searchStore.toggleSearchFacetParams,
}))
(observer((props: IProps) => {
  const {
    className, currentSearchFacets, currentMetricsFacets, currentTokensFacets, facetParams, facetCounts,
    toggleSearchFacet
  } = props

  function handleClickFacet(item: { key: string, value: string }) {
    toggleSearchFacet!(item.key)
  }
  function getFacetParams(item: { key: string, value: string }) {
    return facetParams ? facetParams[item.key] : undefined
  }
  function getFacetCounts(item: { key: string, value: string }) {
    return facetCounts && facetCounts[item.key] ? facetCounts[item.key] : []
  }
  return (
    <Container className={className}>
      <h2>Available facets for: {currentSearchFacets?.programming_language}</h2>
      <Body>
        <Group>
          <Title>Metrics</Title>
          <SearchFacetGroupList
            items={currentMetricsFacets || []}
            getFacetParams={getFacetParams}
            getFacetCounts={getFacetCounts}
            onClickFacet={handleClickFacet}
          />
        </Group>
        <Group>
          <Title>Tokens</Title>
          <SearchFacetGroupList
            items={currentTokensFacets || []}
            getFacetParams={getFacetParams}
            getFacetCounts={getFacetCounts}
            onClickFacet={handleClickFacet}
          />
        </Group>
      </Body>
    </Container>
  )
}))

const Container = styled.div`
  margin: 2rem;
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
  }
`
const Group = styled.div``
const Title = styled.h3``

export const SearchFilters = styled(SearchFiltersEl)``
