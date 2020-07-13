import React from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'

import { ISearchFacetParams } from 'shared'

interface IProps {
  className?: string
  item: { key: string, value: string }
  params?: ISearchFacetParams
  counts: { value: string, count: number }[]
  onClick: (item: { key: string, value: string }) => void
}

const SearchFacetGroupItemEl = observer((props: IProps) => {
  const { className, item, params, counts, onClick } = props
  const active = params !== undefined
  return (
    <Container className={className} onClick={() => onClick(item)}>
      <FacetName minimized={active}>{item.value}</FacetName>
      <Body minimized={!active}>
        <Title>{item.value}</Title>
        <CountsList>
        { counts.map((count, i) =>
          <CountsListItem key={i}>
            <CountName>{count.value}</CountName>
            <CountValue>{count.count}</CountValue>
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
`
const Body = styled.fieldset<{ minimized: boolean }>`
  background: #fff;
  display: ${({ minimized }) => minimized ? 'none' : 'flex'};
  visibility: ${({ minimized }) => minimized ? 'hidden' : 'initial'};
`
const Title = styled.legend``

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
