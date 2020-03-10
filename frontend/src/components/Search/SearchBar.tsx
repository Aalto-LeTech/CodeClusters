import React, { memo, forwardRef } from 'react'
import styled from 'styled-components'
import { FiSearch } from 'react-icons/fi'

import { Input } from '../../elements/Input'

import { useDebouncedCallback } from '../../hooks/useDebounce'

interface IProps {
  className?: string
  name: string
  onSearch: (val: string) => void
}

const SearchBarEl = memo(forwardRef((props: IProps, ref) => {
  const {
    className, name, onSearch
  } = props
  const debouncedSearch = useDebouncedCallback(onSearch, 500)

  function handleChange(newVal: string) {
    debouncedSearch(newVal)
  }
  return (
    <div className={className}>
      <SearchWrapper>
        <IconWrapper >
          <SearchIcon size={18} />
        </IconWrapper>
        <StyledInput
          fullWidth
          type="text"
          placeholder={"Search"}
          autocomplete="off"
          name={name}
          ref={ref}
          onChange={handleChange}
        />
      </SearchWrapper>
    </div>
  )
}))

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid;
  border-radius: 4px;
  justify-content: space-between;
  &:hover, &:active, &:focus {
    border-color: #40a9ff;
    color: ${({ theme }) => theme.color.textDark};
    outline: auto 5px;
    outline-color: rgba(0, 103, 244, 0.247);
    outline-offset: -1px;
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
  padding: 0 0 0 1rem;
`
const SearchIcon = styled(FiSearch)`
  vertical-align: middle;
`

export const SearchBar = styled(SearchBarEl)`
  position: relative;
`
