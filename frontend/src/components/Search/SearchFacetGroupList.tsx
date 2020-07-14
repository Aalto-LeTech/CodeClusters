import React from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'

import { SearchFacetGroupItem } from './SearchFacetGroupItem'
 
import { ISearchFacetParams } from 'shared'
import { FacetItem, FacetField } from '../../types/search'

interface IProps {
  className?: string
  visible: boolean
  items: FacetItem[]
  getFacetParams: (item: FacetItem) => ISearchFacetParams | undefined
  getFacetCounts: (item: FacetItem) => FacetField[]
  getToggledFacetFields: (item: FacetItem) => { [field: string]: boolean }
  onClickFacet: (item: FacetItem) => void
  onToggleFacetField: (item: FacetItem, field: FacetField, val: boolean) => void
}

const SearchFacetGroupListEl = observer((props: IProps) => {
  const { className, visible, items, getFacetParams, getFacetCounts, onClickFacet, onToggleFacetField, getToggledFacetFields } = props
  return (
    <Container className={className} visible={visible}>
      <FacetList>
      { items.map((item, i) =>
        <FacetListItem key={i}>
          <SearchFacetGroupItem
            item={item}
            params={getFacetParams(item)}
            counts={getFacetCounts(item)}
            toggledFields={getToggledFacetFields(item)}
            onClick={onClickFacet}
            onToggleFacetField={onToggleFacetField}
          />
        </FacetListItem>
      )}
      </FacetList>
    </Container>
  )
})

const Container = styled.fieldset<{ visible: boolean }>`
  background: #fff;
  display: ${({ visible }) => visible ? 'block' : 'none'};
  visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
`
const FacetList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 10px 0 0 0;
`
const FacetListItem = styled.li`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
`

export const SearchFacetGroupList = styled(SearchFacetGroupListEl)``
