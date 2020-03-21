import React, { memo, useState } from 'react'
import styled from 'styled-components'

import { SearchConsole } from './SearchConsole'
import { SearchResultsList } from './SearchResultsList'
import { LeftPanel } from './LeftPanel'

interface IProps {
  className?: string
}

const SearchViewEl = memo((props: IProps) => {
  const { className } = props
  return (
    <Container className={className}>
      <SearchConsole />
      <Body>
        <LeftPanel />
        <SearchResultsList />
      </Body>
    </Container>
  )
})

const Container = styled.section``
const Body = styled.div`
  display: flex;
  & > ${SearchResultsList} {
    margin: 0 2rem;
  }
`

export const SearchView = styled(SearchViewEl)``
