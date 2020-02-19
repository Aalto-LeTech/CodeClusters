import * as React from 'react'
import styled from '../theme/styled'
import { FiX } from 'react-icons/fi'

interface IProps {
  className?: string
  value?: string
  items: string[]
  name?: string
  autocomplete?: 'on' | 'off'
  type?: 'email' | 'text'
  icon?: React.ReactNode
  iconPadding?: string
  fullWidth?: boolean
  disabled?: boolean
  placeholder?: string
  required?: boolean
  onChange: (value: string) => void
  onAddItem: (item: string) => void
  onRemoveItem: (item: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

MultiInputEl.defaultProps = {
  autocomplete: 'off',
  required: false,
  type: 'text',
  disabled: false,
}

function MultiInputEl(props: IProps) {
  const {
    className, value, items, type, name, autocomplete, icon, iconPadding, placeholder, disabled, required, fullWidth, onFocus, onBlur
  } = props
  function handleClickX(item: string) {
    !disabled && props.onRemoveItem(item)
  }
  function handleKeyPress(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (!disabled && value) {
        props.onAddItem(value)
        props.onChange('')
      }
    }
  }
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    !disabled && props.onChange(event.target.value)
  }
  return (
    <Container className={className} fullWidth={fullWidth}>
      { icon }
      { items.map(item =>
      <Item key={item}>
        <ItemText>{item}</ItemText>
        <SvgWrapper onClick={() => handleClickX(item)}><FiX size={20}/></SvgWrapper>
      </Item>
      )}
      <StyledInput
        value={value}
        type={type}
        name={name}
        autocomplete={autocomplete}
        iconPadding={iconPadding}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        onFocus={onFocus}
        onBlur={onBlur}
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
  border: 1px solid ${({ theme }) => theme.color.textDark};
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
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
  margin: 4px;
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
  border: 0;
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
