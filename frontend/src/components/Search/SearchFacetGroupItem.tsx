import React from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'

import { CheckBox } from '../../elements/CheckBox'

import { ISearchFacetParams, ISearchFacetRange } from 'shared'
import { FacetItem, FacetField } from '../../types/search'

interface IProps {
  className?: string
  useRange: boolean
  item: FacetItem
  params?: ISearchFacetParams
  counts: FacetField[]
  toggledFields: { [field: string]: boolean }
  onClick: (item: FacetItem) => void
  onToggleFacetField: (item: FacetItem, field: FacetField, val: boolean) => void
  onChangeFacetRange: (item: FacetItem, range?: ISearchFacetRange) => void
}

const EMPTY_RANGE = {
  start: 0,
  end: 50,
  gap: 10,
}

const SearchFacetGroupItemEl = observer((props: IProps) => {
  const {
    className, useRange, item, params, counts, toggledFields,
    onClick, onToggleFacetField, onChangeFacetRange
  } = props
  const active = params !== undefined
  const useRangeChecked = params !== undefined && typeof params === 'object'
  const start = params !== undefined && typeof params === 'object' ? params.start : EMPTY_RANGE.start
  const end = params !== undefined && typeof params === 'object' ? params.end : EMPTY_RANGE.end
  const gap = params !== undefined && typeof params === 'object' ? params.gap : EMPTY_RANGE.gap
  function handleToggleUseRange(val: boolean) {
    if (val) {
      onChangeFacetRange(item, EMPTY_RANGE)
    } else {
      onChangeFacetRange(item)
    }
  }
  function handleRangeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    const data = params !== undefined && typeof params === 'object' ? params : EMPTY_RANGE
    const payload = { ...data, [name]: parseInt(value) }
    onChangeFacetRange(item, payload)
  }
  const handleFacetFieldToggle = (field: FacetField) => (val: boolean) => {
    onToggleFacetField(item, field, val)
  }
  return (
    <Container className={className}>
      <FacetName minimized={active} onClick={() => onClick(item)}>{item.value}</FacetName>
      <Body minimized={!active}>
        <Title onClick={() => onClick(item)}>{item.value}</Title>
        <BodyWrapper>
        <CheckBoxField visible={useRange}>
          <CheckBox checked={useRangeChecked} onChange={handleToggleUseRange}/>
          <CheckBoxText>Use range</CheckBoxText>
        </CheckBoxField>
        <RangeForm visible={useRangeChecked}>
          <RangeField>
            <label>Start</label>
            <RangeInput type="number" name="start" value={start} onChange={handleRangeChange}/>
          </RangeField>
          <RangeField>
            <label>End</label>
            <RangeInput type="number" name="end" value={end} onChange={handleRangeChange}/>
          </RangeField>
          <RangeField>
            <label>Gap</label>
            <RangeInput type="number" name="gap" value={gap} onChange={handleRangeChange}/>
          </RangeField>
        </RangeForm>
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
        </BodyWrapper>
      </Body>
    </Container>
  )
})

const Container = styled.div``
const FacetName = styled.div<{ minimized: boolean }>`
  cursor: pointer;
  display: ${({ minimized }) => minimized ? 'none' : 'flex'};
  padding: 2px;
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
  cursor: pointer;
  padding: 2px;
  &:hover {
    background: #ededed;
  }
`
const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  & > * + * {
    margin-top: 0.75rem;
  }
`
const RangeForm = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => visible ? 'flex' : 'none'};
  visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
  & > * {
    width: 40px;
    &:not(:first-child) {
      margin-left: 0.5rem;
    }
  }
`
const RangeField = styled.div`
  display: flex;
  flex-direction: column;
`
const RangeInput = styled.input`
  font-size: 1rem;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
    -moz-appearance: textfield;
  }
`
const CheckBoxField = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => visible ? 'flex' : 'none'};
  visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
`
const CheckBoxText = styled.label`
  align-items: center;
  display: flex;
  margin-left: 8px;
`
const CountsList = styled.ul`
  & > li + li {
    margin-top: 0.4rem;
  }
`
const CountsListItem = styled.li`
  display: flex;
  justify-content: space-between;
`
const CountName = styled.div``
const CountValue = styled.div``

export const SearchFacetGroupItem = styled(SearchFacetGroupItemEl)``
