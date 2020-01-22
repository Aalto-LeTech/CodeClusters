import React from 'react'
import styled from '../theme/styled'

interface IProps {
  className?: string
  inline?: boolean
  children: React.ReactNode
}

IconEl.defaultProps = {
  inline: true
}

function IconEl(props: IProps) {
  const { className, inline, children } = props
  return (
    <Wrapper className={className} inline={inline}>
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

export const Icon = styled(IconEl)``
