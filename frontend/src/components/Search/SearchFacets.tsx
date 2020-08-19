import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'
import {
  FiChevronDown, FiChevronUp, FiTrash
} from 'react-icons/fi'

import { SearchFacetGroupList } from './SearchFacetGroupList'
import { Icon } from '../../elements/Icon'
import { Tooltip } from '../../elements/Tooltip'

import { Stores } from '../../stores'
import { FacetItem } from '../../types/search'

interface IProps {
  className?: string
  currentMetricsFacets?: FacetItem[]
  currentTokensFacets?: FacetItem[]
  resetFacets?: (type: 'metrics' | 'tokens') => void
}

const SearchFacetsEl = inject((stores: Stores) => ({
  currentMetricsFacets: stores.searchFacetsStore.currentMetricsFacets,
  currentTokensFacets: stores.searchFacetsStore.currentTokensFacets,
  resetFacets: stores.searchFacetsStore.resetFacets,
}))
(observer((props: IProps) => {
  const {
    className, currentMetricsFacets, currentTokensFacets, resetFacets
  } = props
  const [metricsMinimized, setMetricsMinimized] = useState(false)
  const [tokensMinimized, setTokensMinimized] = useState(false)
  function handleCloseMetrics() {
    setMetricsMinimized(!metricsMinimized)
    resetFacets!('metrics')
  }
  function handleCloseTokens() {
    setTokensMinimized(!tokensMinimized)
    resetFacets!('tokens')
  }
  return (
    <Container className={className}>
      <Group>
        <FacetGroupHeader>
          <TitleWrapper>
            <Title>Metrics</Title>
            <Tooltip title="Metrics facets" size={20}>
              <TooltipText>
                <p>
                  Facets are a special Lucene API to easily categorize search results.
                  In this case they are used to quickly filter and select submissions based on their metric values.
                  Current Java metrics are generated using Checkstyle metrics.
                </p>
                <p>
                  Whenever you change the facet values, you must rerun the search. Closing a facet will delete its values.
                  Running the query without specifying a range will yield the values as counts of single values (which is why all
                  metrics are integers). For a range you can specify its start, end and the gap, interval used to bucket the values
                  with.
                </p>
                <div>
                  <a href="https://lucene.apache.org/solr/guide/8_6/faceting.html" target="_blank" rel="noopener">
                    Solr 8.6 docs
                  </a>
                </div>
              </TooltipText>
            </Tooltip>
          </TitleWrapper>
          <Icon button onClick={handleCloseMetrics}>
            { metricsMinimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
          </Icon>
        </FacetGroupHeader>
        <SearchFacetGroupList
          useRange={true}
          visible={!metricsMinimized}
          items={currentMetricsFacets || []}
        />
      </Group>
      <Group>
        <FacetGroupHeader>
          <Title>Tokens</Title>
          <Icon button onClick={handleCloseTokens}>
            { tokensMinimized ? <FiChevronDown size={18}/> : <FiChevronUp size={18}/>}
          </Icon>
        </FacetGroupHeader>
        <SearchFacetGroupList
          useRange={false}
          visible={!tokensMinimized}
          items={currentTokensFacets || []}
        />
      </Group>
    </Container>
  )
}))

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 2rem;
`
const FacetGroupHeader = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
`
const Group = styled.div``
const Title = styled.h3`
  margin-right: 0.5rem;
`
const TitleWrapper = styled.div`
  align-items: center;
  display: flex;
  margin-right: 1rem;
`
const TooltipText = styled.div`
  font-size: ${({ theme }) => theme.fontSize.small};
  margin: 0;
  & > div {
    margin: 0.5rem 0 0 0;
  }
`

export const SearchFacets = styled(SearchFacetsEl)``
