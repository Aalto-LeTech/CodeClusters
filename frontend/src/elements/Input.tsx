import React, { forwardRef } from 'react'
import styled from '../theme/styled'

interface IProps {
  className?: string
  value?: string | number
  name?: string
  autocomplete?: 'on' | 'off'
  type?: 'email' | 'password' | 'text' | 'number' | 'search' | 'textarea'
  icon?: React.ReactNode
  iconPadding?: string
  fullWidth?: boolean
  disabled?: boolean
  placeholder?: string
  required?: boolean
  onChange?: (value: string) => void // Basically one of: string | file
  onFocus?: () => void
  onBlur?: () => void
  onKeyPress?: (e: React.KeyboardEvent) => void
}

const InputEl = forwardRef((props: IProps, ref?: any) => {
  const {
    className, value, type, name, autocomplete, icon, iconPadding, placeholder, disabled, required, fullWidth,
    onChange, onFocus, onBlur, onKeyPress
  } = props
  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    !disabled && onChange && onChange(event.target.value)
  }
  return (
    <Container className={className} fullWidth={fullWidth}>
      { icon }
      { type === 'textarea' ?
        <StyledTextarea
          ref={ref}
          value={value}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
        />
        :
        <StyledInput
          ref={ref}
          value={value}
          type={type}
          name={name}
          autocomplete={autocomplete}
          iconPadding={iconPadding}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
        />
      }
    </Container>
  )
})

InputEl.defaultProps = {
  autocomplete: 'off',
  required: false,
  type: 'text',
  disabled: false,
}

type ContainerProps = { fullWidth?: boolean }
const Container = styled.div<ContainerProps>`
  align-items: center;
  border: 1px solid ${({ theme }) => theme.color.textDark};
  border-radius: 4px;
  display: flex;
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
const StyledTextarea = styled.textarea`
  border: 0;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSize.medium};
  height: 100%;
  min-height: 100px;
  padding: 0.5rem;
  width: 100%;
`
const StyledInput = styled.input<{ autocomplete?: string, iconPadding?: string }>`
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
export const Input = styled(InputEl)``
