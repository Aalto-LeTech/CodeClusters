import React, { useCallback, useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'
import {
  FiLayers, FiAlignLeft, FiChevronDown, FiChevronUp, FiTrash
} from 'react-icons/fi'

import { SearchFacetGroupList } from './SearchFacetGroupList'
import { Icon } from '../../elements/Icon'

import { IProgrammingLanguageFacets, ISearchFacetParams } from 'shared'
import { Stores } from '../../stores'
import { FacetItem, FacetField } from '../../types/search'

interface IProps {
  className?: string
  currentSearchFacets?: IProgrammingLanguageFacets | undefined
  currentMetricsFacets?: FacetItem[]
  currentTokensFacets?: FacetItem[]
  facetParams?: { [facet: string] : ISearchFacetParams }
  facetCounts?: { [facet: string] : FacetField[] }
  selectedFacetFields?: { [facet_field: string]: boolean }
  toggleSearchFacet?: (facet: string) => void
  toggleFacetField?: (item: FacetItem, field: FacetField, val: boolean) => void
}

const SearchFiltersEl = inject((stores: Stores) => ({
  currentSearchFacets: stores.searchStore.currentSearchFacets,
  currentMetricsFacets: stores.searchStore.currentMetricsFacets,
  currentTokensFacets: stores.searchStore.currentTokensFacets,
  facetParams: stores.searchStore.currentFacetParams,
  facetCounts: stores.searchStore.selectedSearchResult.facetCounts,
  selectedFacetFields: stores.searchStore.selectedFacetFields,
  toggleSearchFacet: stores.searchStore.toggleSearchFacetParams,
  toggleFacetField: stores.searchStore.toggleFacetField,
}))
(observer((props: IProps) => {
  const {
    className, currentSearchFacets, currentMetricsFacets, currentTokensFacets, facetParams, facetCounts, selectedFacetFields,
    toggleSearchFacet, toggleFacetField
  } = props
  const [metricsMinimized, setMetricsMinimized] = useState(false)
  const [tokensMinimized, setTokensMinimized] = useState(false)

  function handleClickFacet(item: FacetItem) {
    toggleSearchFacet!(item.key)
  }
  function handleToggleFacetField(item: FacetItem, field: FacetField, val: boolean) {
    toggleFacetField!(item, field, val)
  }
  function getFacetParams(item: FacetItem) {
    return facetParams ? facetParams[item.key] : undefined
  }
  function getFacetCounts(item: FacetItem) {
    return facetCounts && facetCounts[item.key] ? facetCounts[item.key] : []
  }
  const getToggledFacetFields = useCallback((item: FacetItem) => {
    const prefix = `${item.key}.`
    return Object.keys(selectedFacetFields!)
      .filter(val => val.includes(prefix))
      .reduce((acc: { [field: string]: boolean }, facetField) => {
        const field = facetField.substring(prefix.length)
        acc[field] = selectedFacetFields![facetField] || false
        return acc
      }, {})
  }, [selectedFacetFields])

  return (
    <Container className={className}>
      <h2>Available facets for: {currentSearchFacets?.programming_language}</h2>
      <Body>
        <Group>
          <FacetGroupHeader>
            <Title>Metrics</Title>
            <Icon button onClick={() => setMetricsMinimized(!metricsMinimized)}>
              { metricsMinimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
            </Icon>
          </FacetGroupHeader>
          <SearchFacetGroupList
            visible={!metricsMinimized}
            items={currentMetricsFacets || []}
            getFacetParams={getFacetParams}
            getFacetCounts={getFacetCounts}
            getToggledFacetFields={getToggledFacetFields}
            onClickFacet={handleClickFacet}
            onToggleFacetField={handleToggleFacetField}
          />
        </Group>
        <Group>
        <FacetGroupHeader>
            <Title>Tokens</Title>
            <Icon button onClick={() => setTokensMinimized(!tokensMinimized)}>
              { tokensMinimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
            </Icon>
          </FacetGroupHeader>
          <SearchFacetGroupList
            visible={!tokensMinimized}
            items={currentTokensFacets || []}
            getFacetParams={getFacetParams}
            getFacetCounts={getFacetCounts}
            getToggledFacetFields={getToggledFacetFields}
            onClickFacet={handleClickFacet}
            onToggleFacetField={handleToggleFacetField}
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
const FacetGroupHeader = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
`
const Group = styled.div``
const Title = styled.h3`
  margin-right: 1rem;
`

export const SearchFilters = styled(SearchFiltersEl)``
