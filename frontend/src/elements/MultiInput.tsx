import * as React from 'react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

interface IProps {
  className?: string
  value?: string
  items: string[]
  id?: string
  name?: string
  autocomplete?: 'on' | 'off'
  type?: 'email' | 'text'
  icon?: React.ReactNode
  iconPadding?: string
  fullWidth?: boolean
  disabled?: boolean
  placeholder?: string
  onChange: (value: string) => void
  onAddItem: (item: string) => void
  onRemoveItem: (item: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

MultiInputEl.defaultProps = {
  autocomplete: 'off',
  type: 'text',
  disabled: false,
}

function MultiInputEl(props: IProps) {
  const {
    className, value, items, type, id, name, autocomplete, icon, iconPadding, placeholder, disabled,
    fullWidth, onFocus, onBlur, onChange, onAddItem, onRemoveItem
  } = props
  function handleClickX(item: string) {
    !disabled && onRemoveItem(item)
  }
  function handleKeyPress(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (!disabled && value) {
        onAddItem(value)
        onChange('')
      }
    }
  }
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    !disabled && onChange(event.target.value)
  }
  function handleBlur() {
    if (!disabled && value && value.length > 0) {
      onAddItem(value)
      onChange('')
    }
    if (onBlur) onBlur()
  }
  return (
    <Container className={className} fullWidth={fullWidth}>
      { icon }
      { items.map((item, index) =>
      <Item key={`mi_${index}_${item}`}>
        <ItemText>{item}</ItemText>
        <SvgWrapper onClick={() => handleClickX(item)}><FiX size={20}/></SvgWrapper>
      </Item>
      )}
      <StyledInput
        value={value}
        type={type}
        id={id}
        name={name}
        autocomplete={autocomplete}
        iconPadding={iconPadding}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        onFocus={onFocus}
        onBlur={handleBlur}
      />
    </Container>
  )
}

const SvgWrapper = styled.span`
  align-items: center;
  cursor: pointer;
  display: flex;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 0.3rem;
  &:hover {
    background-color: rgb(255, 189, 173);
    color: rgb(222, 53, 11);
  }
`
type ContainerProps = { fullWidth?: boolean }
const Container = styled.div<ContainerProps>`
  align-items: center;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 6px;
  position: relative;
  width: ${({ fullWidth }) => fullWidth ? '100%' : '180px'};
  &:focus {
    background-image: linear-gradient(to right, #cefff8, #729EE74D);
    color: ${({ theme }) => theme.color.textDark};
    outline: auto 5px;
  }
  & > svg {
    left: 8px;
    position: absolute;
  }
`
const Item = styled.div`
  align-items: center;
  box-sizing: border-box;
  border-radius: 2px;
  background-color: rgb(230, 230, 230);
  display: flex;
  justify-content: center;
  min-width: 0px;
  margin: 0 6px 6px 0;
`
const ItemText = styled.span`
  color: rgb(51, 51, 51);
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  border-radius: 2px;
  overflow: hidden;
  padding: 0 0.25rem 0 0.5rem;
`
interface InputProps {
  autocomplete?: 'on' | 'off'
  iconPadding?: string
}
const StyledInput = styled.input<InputProps>`
  background-color: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.textDark};
  border-radius: 4px;
  color: ${({ theme }) => theme.color.textDark};
  font-size: ${({ theme }) => theme.fontSize.medium};
  padding: 0.5rem 0.5rem;
  padding-left: ${({ iconPadding }) => iconPadding || ''};
  text-decoration: none;
  transition: 0.1s all;
  width: 100%;
  &:focus {
    background-image: linear-gradient(to right,#fcffff,#e6f8ff4d);
    color: ${({ theme }) => theme.color.textDark};
  }
`
export const MultiInput = styled(MultiInputEl)``
