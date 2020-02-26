import React, { memo, useState } from 'react'
import styled from 'styled-components'

import { SearchConsole } from './SearchConsole'
import { SearchResultsList } from './SearchResultsList'

interface IProps {
  className?: string
}

const SearchViewEl = memo((props: IProps) => {
  const { className } = props
  return (
    <Container className={className}>
      <SearchConsole />
      <SearchResultsList />
    </Container>
  )
})

const Container = styled.section``

export const SearchView = styled(SearchViewEl)``
