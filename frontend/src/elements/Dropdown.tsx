import React, { useRef, useState } from 'react'
import styled from '../theme/styled'
import { FiChevronDown } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'

type OptionValue = string | number
type Option<T extends OptionValue> = {
  key: string | number
  value: T
}
interface IProps<T extends OptionValue> {
  className?: string
  options: Option<T>[]
  selected?: T
  disabled?: boolean
  required?: boolean
  placeholder?: string
  fullWidth?: boolean
  onSelect: (option: Option<T>) => void
}

DropdownEl.defaultProps = {
  placeholder: 'Choose',
}

function DropdownEl<T extends OptionValue>(props: IProps<T>) {
  const {
    className, options, selected, disabled, required, placeholder, fullWidth, onSelect
  } = props

  function closeMenu() {
    setMenuOpen(false)
  }
  function toggleMenu() {
    !disabled && setMenuOpen(oldMenuOpen => !oldMenuOpen)
  }
  function isSelected(option: Option<T>) {
    return option.value === selected
  }
  function getButtonText() {
    if (selected) {
      return selected
    }
    return placeholder
  }
  const selectOption = (option: Option<T>) => (e: React.MouseEvent) => {
    e.stopPropagation()
    if (option.value !== selected) {
      onSelect(option)
      closeMenu()
    }
  }
  const ref = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  useClickOutside(ref, (e) => closeMenu(), menuOpen)
  return (
    <Container className={className} ref={ref} fullWidth={fullWidth}>
      <Button onClick={toggleMenu} aria-haspopup aria-label="Dropdown menu">
        {getButtonText()} 
        <SvgWrapper><FiChevronDown size={18}/></SvgWrapper>
      </Button>
      <DropdownList open={menuOpen}>
        { options.map(o =>
        <Option key={o.key}>
          <OptionButton
            onClick={selectOption(o)}
            selected={isSelected(o)}
          >{o.value}</OptionButton>
        </Option>
        )}
      </DropdownList>
    </Container>
  )
}

const Container = styled.div<{ fullWidth?: boolean }>`
  background: transparent;
  border: 0;
  display: inline-block;
  padding: 0;
  position: relative;
  width: ${({ fullWidth }) => fullWidth ? '100%' : '180px'};
`
const SvgWrapper = styled.span`
  display: flex;
`
const Button = styled.button`
  align-items: center;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color.textDark};
  border-radius: 26px;
  cursor: pointer;
  display: flex;
  font-size: ${({ theme }) => theme.fontSize.medium};
  justify-content: center;
  padding: 0.5rem 0.75rem 0.5rem 1rem;
  position: relative;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
  & > ${SvgWrapper} {
    margin-left: 6px;
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
  z-index: 10;
  transform: scale(1, 1) translateZ(0px);
  transition: opacity 284ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 189ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  top: 0;
  transform-origin: 251px 0px;
`
const Option = styled.li`
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

export const GenericDropdown = <T extends OptionValue>() => styled((props: IProps<T>) => <DropdownEl<T> {...props} />)``

export const Dropdown = GenericDropdown<string>()
