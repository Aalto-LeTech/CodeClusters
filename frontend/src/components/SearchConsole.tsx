import React, { memo, useRef, useState } from 'react'
import styled from 'styled-components'

import { SearchBar } from './SearchBar'

interface IProps {
  className?: string
}

const SearchConsoleEl = (props: IProps) => {
  const {
    className
  } = props
  function handleSearch(newVal: string) {
    console.log(newVal)
  }
  return (
    <div className={className}>
      <SearchBar onSearch={handleSearch}/>
    </div>
  )
}

export const SearchConsole = styled(SearchConsoleEl)`
`
