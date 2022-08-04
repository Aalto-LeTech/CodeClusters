import React from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'

import { SearchFacetGroupItem } from './SearchFacetGroupItem'
 
import { FacetItem } from '../../types/search'

interface IProps {
  className?: string
  visible: boolean
  useRange: boolean
  items: FacetItem[]
}

const SearchFacetGroupListEl = observer((props: IProps) => {
  const {
    className, visible, useRange, items,
  } = props
  return (
    <Container className={className} visible={visible}>
      <FacetList>
      { items.map(item =>
        <FacetListItem key={`fli-${item.key}`}>
          <SearchFacetGroupItem
            useRange={useRange}
            item={item}
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
  padding: 4px 8px;
`

export const SearchFacetGroupList = styled(SearchFacetGroupListEl)``
