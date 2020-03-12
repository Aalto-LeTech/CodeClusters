import React from 'react'
import styled, { getIntentColor, getIntentTextColor } from '../theme/styled'

import { Spinner } from './Spinner'

import { Intent } from '../types/theme'

interface IProps {
  children?: React.ReactNode
  className?: string
  intent?: Intent
  type?: 'button' | 'submit' | 'reset' | 'link'
  disabled?: boolean
  href?: string
  loading?: boolean
  fullWidth?: boolean
  onClick?: () => void
}

function ButtonEl(props: IProps) {
  function handleClick(e: React.MouseEvent) {
    return !props.disabled && props.onClick && props.onClick()
  }
  const { className, children, onClick, type, disabled, loading, href } = props
  return (
    <>
    { type === 'link' ?
      <a
        className={className}
        onClick={onClick}
        type={type}
        href={href}
      >
        { loading ? <Spinner /> : children }
      </a> :
      <button
        className={className}
        onClick={handleClick}
        type={type}
        disabled={disabled}
      >
        { loading ? <Spinner /> : children }
      </button>
    }
    </>
  )
}

export const Button = styled(ButtonEl)<IProps>`
  align-items: center;
  background-color: ${({ theme, intent }) => getIntentColor(theme, intent)};
  border: 1px solid ${({ theme, intent }) => intent !== 'transparent' ? theme.color.textDark : 'transparent'};
  border-radius: 4px;
  color: ${({ theme, intent }) => getIntentTextColor(theme, intent)};
  cursor: pointer;
  display: flex;
  font-size: ${({ theme }) => theme.fontSize.medium};
  justify-content: center;
  min-height: calc(2rem + 5px); // Scaled to the size of m-sized Spinner inside Button
  min-width: 100px;
  padding: 0.5rem 1.5rem;
  text-decoration: none;
  width: ${({ fullWidth }) => fullWidth ? '100%' : ''};
  &:hover {
    background: ${({ theme, intent }) => intent === 'transparent' && theme.color.gray.lightest};
    box-shadow: ${({ intent }) => intent !== 'transparent' && '0 0 2px 2px #039be569'};
  }
  transition: 0.2s all;
`

Button.defaultProps = {
  intent: 'primary',
  fullWidth: false,
  type: 'button',
  disabled: false,
  loading: false,
}
