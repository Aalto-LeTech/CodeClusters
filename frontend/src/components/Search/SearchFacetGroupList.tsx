import React from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'

import { SearchFacetGroupItem } from './SearchFacetGroupItem'
 
import { ISearchFacetParams } from 'shared'

interface IProps {
  className?: string
  items: { key: string, value: string }[]
  getFacetParams: (item: { key: string, value: string }) => ISearchFacetParams | undefined
  getFacetCounts: (item: { key: string, value: string }) => { value: string, count: number }[]
  onClickFacet: (item: { key: string, value: string }) => void
}

const SearchFacetGroupListEl = observer((props: IProps) => {
  const { className, items, getFacetParams, getFacetCounts, onClickFacet } = props
  return (
    <Container className={className}>
      <OptionList>
      { items.map((item, i) =>
        <OptionListItem key={i}>
          <SearchFacetGroupItem item={item} params={getFacetParams(item)} counts={getFacetCounts(item)} onClick={onClickFacet}/>
        </OptionListItem>
      )}
      </OptionList>
    </Container>
  )
})

const Container = styled.fieldset`
  background: #fff;
`
const OptionList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 10px 0 0 0;
`
const OptionListItem = styled.li`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  &:hover {
    background: #ededed;
  }
`

export const SearchFacetGroupList = styled(SearchFacetGroupListEl)``
