import React, { useRef, useState } from 'react'
import styled from '../theme/styled'
import { FiChevronDown } from 'react-icons/fi'

import useClickOutside from '../hooks/useClickOutside'

type KeyValue = string | number
type Option<K extends KeyValue, V extends React.ReactNode> = {
  key: K
  value: V
}
interface IProps<K extends KeyValue, V extends React.ReactNode> {
  className?: string
  options: Option<K, V>[]
  selected?: K
  disabled?: boolean
  required?: boolean
  placeholder?: string
  fullWidth?: boolean
  renderMenu?: (text: string) => React.ReactNode
  onSelect: (option: Option<K, V>) => void
}

DropdownEl.defaultProps = {
  placeholder: 'Choose',
}

function DropdownEl<K extends KeyValue, V extends React.ReactNode>(props: IProps<K, V>) {
  const {
    className, options, selected, disabled, required, placeholder, fullWidth, renderMenu, onSelect
  } = props

  function closeMenu() {
    setMenuOpen(false)
  }
  function toggleMenu() {
    !disabled && setMenuOpen(oldMenuOpen => !oldMenuOpen)
  }
  function isSelected(option: Option<K, V>) {
    return option.key === selected
  }
  function isDisabled() {
    return disabled || options.length === 0
  }
  function renderButtonContent() {
    const text = selected ? selected.toString() : (placeholder || 'Choose')
    if (renderMenu) {
      return renderMenu(text)
    }
    return (
      <>
        {text} 
        <SvgWrapper><FiChevronDown size={18}/></SvgWrapper>
      </>
    )
  }
  const selectOption = (option: Option<K, V>) => (e: React.MouseEvent) => {
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
      <Button onClick={toggleMenu} disabled={isDisabled()} aria-haspopup aria-label="Dropdown menu">
        {renderButtonContent()}
      </Button>
      <DropdownList open={menuOpen}>
        { options.map(o =>
        <OptionListItem key={o.key}>
          <OptionButton
            onClick={selectOption(o)}
            selected={isSelected(o)}
          >{o.value}</OptionButton>
        </OptionListItem>
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
const Button = styled.button<{ disabled: boolean }>`
  align-items: center;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color.textDark};
  border-radius: 26px;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  font-size: ${({ theme }) => theme.fontSize.medium};
  justify-content: center;
  padding: 0.5rem 0.75rem 0.5rem 1rem;
  position: relative;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:hover {
    background-color: ${({ disabled }) => disabled ? '' : 'rgba(0, 0, 0, 0.08)'};
  }
  & > ${SvgWrapper} {
    margin-left: 6px;
  }
`
const DropdownList = styled.ul<{ open: boolean }>`
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
const OptionListItem = styled.li``
const OptionButton = styled.button<{ selected: boolean }>`
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

export const GenericDropdown = <K extends KeyValue, V extends React.ReactNode>() =>
  styled((props: IProps<K, V>) => <DropdownEl<K, V> {...props} />)``

export const Dropdown = GenericDropdown<string, string>()
