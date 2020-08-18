import React, { useState } from 'react'
import styled from '../theme/styled'
import { FiHelpCircle, FiX } from 'react-icons/fi'

import { Icon } from './Icon'

interface IProps {
  className?: string
  children: React.ReactNode
  title: string
  size?: number
}

function TooltipEl(props: IProps) {
  const { className, children, title, size = 16 } = props
  const [visible, setVisible] = useState(false)
  function openTooltip() {
    setVisible(true)
  }
  function closeTooltip() {
    setVisible(false)
  }
  return (
    <Wrapper className={className}>
      <Icon button onClick={openTooltip}><FiHelpCircle size={size} /></Icon>
      <TooltipWrapper visible={visible}>
        <TooltipContainer>
          <TooltipHeader>
            <TooltipTitle>{title}</TooltipTitle>
            <Icon button onClick={closeTooltip}><FiX size={16}/></Icon>
          </TooltipHeader>
          {children}
        </TooltipContainer>
      </TooltipWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div``
const TooltipWrapper = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => visible ? 'block' : 'none'};
  font-size: ${({ theme }) => theme.fontSize.medium};
  position: relative;
  visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
`
const TooltipContainer = styled.div`
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.gray.light};
  box-shadow: 5px 5px ${({ theme }) => '#00000016'};
  display: flex;
  flex-direction: column;
  padding: 0.25rem 0.25rem 0.75rem 0.5rem;
  position: absolute;
  top: -2rem;
  transition: 0.2s all;
  width: 300px;
  z-index: 100;
`
const TooltipHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`
const TooltipTitle = styled.h5`
  margin: 0;
`

export const Tooltip = styled(TooltipEl)``
