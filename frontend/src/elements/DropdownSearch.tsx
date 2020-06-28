import React, { memo, useRef, useState } from 'react'
import styled from '../theme/styled'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

import { Input } from './Input'
import { Icon } from './Icon'

import useClickOutside from '../hooks/useClickOutside'

interface IDropdownOption {
  key: string
  value: string
}
interface IProps {
  className?: string
  options: IDropdownOption[]
  selected?: string
  value: string
  disabled?: boolean
  placeholder?: string
  fullWidth?: boolean
  onChange: (val: string) => void
  onSelect: (option: IDropdownOption) => void
}

const DropdownSearchEl = memo((props: IProps) => {
  const {
    className, value, options, selected, disabled, placeholder = 'Search', fullWidth, onChange, onSelect
  } = props
  const [shownItems, setShownItems] = useState(options.map(o => true))
  const ref = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  useClickOutside(ref, (e) => closeMenu(), menuOpen)

  function closeMenu() {
    setMenuOpen(false)
  }
  function isSelected(option: IDropdownOption) {
    return option.value === selected
  }
  function toggleMenu() {
    if (!disabled) {
      setMenuOpen(oldMenuOpen => !oldMenuOpen)
      setShownItems(options.map(o => true))
    }
  }
  function handleSearchChange(val: string) {
    onChange(val)
    const l = val.toLowerCase()
    setShownItems(options.map(o => o.value.toString().toLowerCase().includes(l)))
  }
  function handleSearchFocus() {
    setMenuOpen(true)
    setShownItems(options.map(o => true))
  }
  function handleSearchKeyPress(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      const firstItemIndex = shownItems.findIndex(s => s === true)
      if (firstItemIndex !== -1) {
        const item = options[firstItemIndex]
        onSelect(item)
        onChange(item.value.toString())
      }
      setMenuOpen(false)
    }
  }
  const selectOption = (option: IDropdownOption) => (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(option.value)
    setMenuOpen(false)
    onSelect(option)
  }
  return (
    <Container className={className} ref={ref} fullWidth={fullWidth}>
      <InputWrapper>
        <Input
          fullWidth
          placeholder={placeholder}
          value={value}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          onKeyPress={handleSearchKeyPress}
        />
        <MenuButton type="button" aria-haspopup aria-label="Dropdown menu" onClick={toggleMenu}>
          <Icon>
            { menuOpen ? <FiChevronUp size={18}/> : <FiChevronDown size={18}/>}
          </Icon>
        </MenuButton>
      </InputWrapper>
      <DropdownList open={menuOpen}>
        { options.map((o, i) =>
        <OptionItem key={`ds_${o.key}_${i}`} visible={shownItems[i]}>
          <OptionButton
            type="button"
            onClick={selectOption(o)}
            selected={isSelected(o)}
          >{o.value}</OptionButton>
        </OptionItem>
        )}
      </DropdownList>
    </Container>
  )
})

const Container = styled.div<{ fullWidth?: boolean }>`
  background: transparent;
  border: 0;
  display: inline-block;
  padding: 0;
  position: relative;
  width: ${({ fullWidth }) => fullWidth ? '100%' : '180px'};
`
const MenuButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.color.green};
  border: 0;
  border-bottom-right-radius: 4px;
  border-top-right-radius: 4px;
  cursor: pointer;
  display: flex;
  font-size: ${({ theme }) => theme.fontSize.medium};
  justify-content: center;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  position: relative;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:hover {
    background-color: #00c364; // rgba(0, 0, 0, 0.08);
  }
  & > ${Icon} {
    height: 19px;
  }
`
const InputWrapper = styled.div`
  align-items: center;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color.textDark};
  border-radius: 4px;
  display: inline-flex;
  justify-content: center;
  width: 100%;
  & > ${Input} {
    border: 0;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    & > input {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }
  }
`
type DropdownProps = { open: boolean }
const DropdownList = styled.ul<DropdownProps>`
  background-color: #fff;
  border-color: #b5b5b5;
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  box-shadow: 1px 1px #b5b5b570;
  color: ${({ theme }) => theme.color.textDark};
  display: ${({ open }) => open ? 'block' : 'none'};
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 0;
  width: 100%;
  z-index: 100;
  transform: scale(1, 1) translateZ(0px);
  transition: opacity 284ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 189ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  top: 36px;
  transform-origin: 251px 0px;
`
const OptionItem = styled.li<{ visible: boolean }>`
  display: ${({ visible }) => visible ? 'initial' : 'none'};
  visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
`
type OptionButtonProps = { selected: boolean }
const OptionButton = styled.button<OptionButtonProps>`
  align-items: center;
  display: flex;
  background-color: ${({ selected }) => selected ? 'rgba(0, 0, 0, 0.08)' : '#fff'};
  border: 0;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
  font-size: 1rem;
  padding: .66rem 1rem;
  transition: all 0.1s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  width: 100%;  
  z-index: 10;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`

export const DropdownSearch = styled(DropdownSearchEl)``
