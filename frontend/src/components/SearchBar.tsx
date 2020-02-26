import React, { memo, useState } from 'react'
import styled from 'styled-components'
import { FiSearch } from 'react-icons/fi'

import { Input } from '../elements/Input'

import { useDebouncedCallback } from '../hooks/useDebounce'

interface IProps {
  className?: string
  onSearch: (val: string) => void
}

const SearchBarEl = memo((props: IProps) => {
  const {
    className, onSearch
  } = props
  const [searchText, setSearchText] = useState('')
  const debouncedSearch = useDebouncedCallback(onSearch, 500)

  function handleChange(newVal: string) {
    setSearchText(newVal)
    debouncedSearch(newVal)
  }
  return (
    <div className={className}>
      <SearchWrapper>
        <IconWrapper >
          <SearchIcon size={18} />
        </IconWrapper>
        <StyledInput
          type="text"
          value={searchText}
          placeholder={"Search"}
          fullWidth
          autocomplete="off"
          onChange={handleChange}
        />
      </SearchWrapper>
    </div>
  )
})

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid;
  border-radius: 4px;
  justify-content: space-between;
  &:hover, &:active, &:focus {
    border-color: #40a9ff;
  }
`
const StyledInput = styled(Input)`
  border: 0;
  & > input {
    border: 0;
    font-size: 1.2rem;
    outline: 0;
    padding: 1rem;
  }
`
const IconWrapper = styled.div`
  display: flex; // Center the search icon
  height: 18px;
  padding: 0 4px 0 8px;
`
const SearchIcon = styled(FiSearch)`
  vertical-align: middle;
`

export const SearchBar = styled(SearchBarEl)`
  position: relative;
`
