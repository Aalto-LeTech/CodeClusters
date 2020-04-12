import React, { useRef, useState } from 'react'
import styled from '../theme/styled'

import useHover from '../hooks/useHover'

interface IProps {
  className?: string
  inline?: boolean
  button?: boolean
  disabled?: boolean
  tooltip?: string
  children: React.ReactNode
  onClick?: () => void
}

IconEl.defaultProps = {
  inline: true,
  button: false
}

function IconEl(props: IProps) {
  const { className, inline, button, disabled, tooltip, children, onClick } = props
  const ref = useRef(null)
  const [hoverActive, setHoverActive] = useState(tooltip !== undefined)
  const [tooltipDir, setTooltipDir] = useState('top')
  function handleHover(e: MouseEvent) {
    const { innerHeight, innerWidth } = window
    const { clientX, clientY } = e
    const threshold = 100
    const closeToLeft = clientX < threshold
    const closeToTop = clientY < threshold
    const closeToRight = (clientX + threshold) > innerWidth
    const closeToBottom = (clientY + threshold) > innerHeight
    if (closeToLeft && closeToTop) {
      setTooltipDir('right bottom')
    } else if (closeToTop && closeToRight) {
      setTooltipDir('left bottom')
    } else if (closeToRight && closeToBottom) {
      setTooltipDir('left top')
    } else if (closeToBottom && closeToLeft) {
      setTooltipDir('right top')
    } else if (closeToLeft) {
      setTooltipDir('right')
    } else if (closeToTop) {
      setTooltipDir('bottom')
    } else if (closeToRight) {
      setTooltipDir('left')
    } else if (closeToBottom) {
      setTooltipDir('top')
    }
  }
  useHover(ref, (e) => handleHover(e), hoverActive)
  if (button) {
    return (
      <Wrapper ref={ref} className={className} inline={inline}>
        <Button onClick={onClick} disabled={disabled} title={tooltip} data-tooltip={tooltip} className={tooltipDir}>
          {children}
        </Button>
      </Wrapper>
    )
  }
  return (
    <Wrapper ref={ref} className={`${className} ${tooltipDir}`} inline={inline} title={tooltip} data-tooltip={tooltip}>
      { children }
    </Wrapper>
  )
}

interface IInnerProps {
  inline?: boolean
}
const Wrapper = styled.span<IInnerProps>`
  align-items: center;
  display: ${({ inline }) => inline ? 'inline-flex' : 'flex'};
  justify-content: center;
`
const Button = styled.button`
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: ${({ disabled }) => disabled ? 'cursor' : 'pointer'};
  display: flex;
  padding: 8px;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:hover {
    background-color: ${({ disabled }) => !disabled && 'rgba(0, 0, 0, 0.08)'};
  }
`

export const Icon = styled(IconEl)``
