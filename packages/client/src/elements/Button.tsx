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
  const { className, children, onClick, type, disabled, loading, href } = props

  function handleClick(e: React.MouseEvent) {
    return !disabled && onClick && onClick()
  }
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
  color: ${({ intent, theme }) => getIntentTextColor(theme, intent)};
  cursor: pointer;
  display: flex;
  font-size: ${({ theme }) => theme.fontSize.medium};
  justify-content: center;
  line-height: 1.1;
  min-height: calc(2rem + 5px); // Scaled to the size of m-sized Spinner inside Button
  min-width: 100px;
  padding: 0.5rem 1.5rem;
  text-decoration: none;
  transition: 0.2s all;
  width: ${({ fullWidth }) => fullWidth ? '100%' : ''};
  &:hover {
    background: ${({ theme, intent }) => intent === 'transparent' && theme.color.gray.lightest};
    box-shadow: ${({ intent }) => intent !== 'transparent' && '0 0 2px 2px #039be569'};
  }
  &:disabled {
    box-shadow: none;
    color: rgba(34, 34, 34, 0.4);
    cursor: default;
  }
`

Button.defaultProps = {
  intent: 'primary',
  fullWidth: false,
  type: 'button',
  disabled: false,
  loading: false,
}
