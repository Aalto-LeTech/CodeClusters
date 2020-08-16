import React, { memo, forwardRef, useState } from 'react'
import styled from 'styled-components'
import { FiSearch } from 'react-icons/fi'

import { Input } from '../../elements/Input'

import { useDebouncedCallback } from '../../hooks/useDebounce'

interface IProps {
  className?: string
  name: string
  id: string
  onSearch: (val: string) => void
}

const SearchBarEl = memo(forwardRef((props: IProps, ref) => {
  const {
    className, name, id, onSearch
  } = props
  const [wrapperFocused, setWrapperFocused] = useState(false)
  const debouncedSearch = useDebouncedCallback(onSearch, 500)

  function handleChange(newVal: string) {
    debouncedSearch(newVal)
  }
  function handleFocus() {
    setWrapperFocused(true)
  }
  function handleBlur() {
    setWrapperFocused(false)
  }
  return (
    <div className={className}>
      <SearchWrapper focused={wrapperFocused}>
        <IconButton >
          <SearchIcon size={26} />
        </IconButton>
        <StyledInput
          fullWidth
          type="search"
          placeholder={"Search"}
          autocomplete="off"
          name={name}
          id={id}
          ref={ref}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </SearchWrapper>
    </div>
  )
}))

const SearchWrapper = styled.div<{ focused: boolean }>`
  display: flex;
  border: 1px solid #000;
  border-radius: 4px;
  justify-content: space-between;
  outline: ${({ focused }) => focused && 'auto 5px'};
  outline-color: ${({ focused }) => focused && '-webkit-focus-ring-color'};
`
const StyledInput = styled(Input)`
  border: 1px solid transparent;
  & > input {
    border: 0;
    font-size: 1.2rem;
    outline: 0;
    padding: 1rem;
  }
`
const IconButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.color.lightGreen};
  border: 0;
  border-right: 1px solid #000;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  cursor: pointer;
  display: flex;
  padding: 0 1.5rem;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:hover {
    background: ${({ theme }) => theme.color.green};
  }
`
const SearchIcon = styled(FiSearch)`
  vertical-align: middle;
`

export const SearchBar = styled(SearchBarEl)`
  position: relative;
`
