import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'
import {
  FiChevronDown, FiChevronUp, FiTrash
} from 'react-icons/fi'

import { SearchFacetGroupList } from './SearchFacetGroupList'
import { Icon } from '../../elements/Icon'

import { Stores } from '../../stores'
import { FacetItem } from '../../types/search'

interface IProps {
  className?: string
  currentMetricsFacets?: FacetItem[]
  currentTokensFacets?: FacetItem[]
}

const SearchFacetsEl = inject((stores: Stores) => ({
  currentMetricsFacets: stores.searchStore.currentMetricsFacets,
  currentTokensFacets: stores.searchStore.currentTokensFacets,
}))
(observer((props: IProps) => {
  const {
    className, currentMetricsFacets, currentTokensFacets,
  } = props
  const [metricsMinimized, setMetricsMinimized] = useState(false)
  const [tokensMinimized, setTokensMinimized] = useState(false)

  return (
    <Container className={className}>
      <Group>
        <FacetGroupHeader>
          <Title>Metrics</Title>
          <Icon button onClick={() => setMetricsMinimized(!metricsMinimized)}>
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
          <Icon button onClick={() => setTokensMinimized(!tokensMinimized)}>
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
  margin-right: 1rem;
`

export const SearchFacets = styled(SearchFacetsEl)``
