import React from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'

import { CheckBox } from '../../elements/CheckBox'

import { ISearchFacetParams } from 'shared'
import { FacetItem, FacetField } from '../../types/search'

interface IProps {
  className?: string
  item: FacetItem
  params?: ISearchFacetParams
  counts: FacetField[]
  toggledFields: { [field: string]: boolean }
  onClick: (item: FacetItem) => void
  onToggleFacetField: (item: FacetItem, field: FacetField, val: boolean) => void
}

const SearchFacetGroupItemEl = observer((props: IProps) => {
  const { className, item, params, counts, toggledFields, onClick, onToggleFacetField } = props
  const active = params !== undefined
  const handleFacetFieldToggle = (field: FacetField) => (val: boolean) => {
    onToggleFacetField(item, field, val)
  }
  return (
    <Container className={className}>
      <FacetName minimized={active} onClick={() => onClick(item)}>{item.value}</FacetName>
      <Body minimized={!active}>
        <Title onClick={() => onClick(item)}>{item.value}</Title>
        <CountsList>
        { counts.map((field, i) =>
          <CountsListItem key={`field-${field}-${i}`}>
            <CheckBox
              checked={toggledFields[field.value] || false}
              onChange={handleFacetFieldToggle(field)}
            />
            <CountName>{field.value}</CountName>
            <CountValue>{field.count}</CountValue>
          </CountsListItem>
        )}
        </CountsList>
      </Body>
    </Container>
  )
})

const Container = styled.div``
const FacetName = styled.div<{ minimized: boolean }>`
  display: ${({ minimized }) => minimized ? 'none' : 'flex'};
  visibility: ${({ minimized }) => minimized ? 'hidden' : 'initial'};
  &:hover {
    background: #ededed;
  }
`
const Body = styled.fieldset<{ minimized: boolean }>`
  background: #fff;
  display: ${({ minimized }) => minimized ? 'none' : 'flex'};
  visibility: ${({ minimized }) => minimized ? 'hidden' : 'initial'};
`
const Title = styled.legend`
  &:hover {
    background: #ededed;
  }
`
const CountsList = styled.ul`
  list-style: none;
  margin: 10px 0 0 0;
`
const CountsListItem = styled.li`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  &:hover {
    background: #ededed;
  }
`
const CountName = styled.div``
const CountValue = styled.div``

export const SearchFacetGroupItem = styled(SearchFacetGroupItemEl)``
