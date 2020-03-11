import React from 'react'
import styled from '../theme/styled'

interface IProps {
  className?: string
  inline?: boolean
  button?: boolean
  children: React.ReactNode
  onClick?: () => void
}

IconEl.defaultProps = {
  inline: true,
  button: false
}

function IconEl(props: IProps) {
  const { className, inline, button, children, onClick } = props
  if (button) {
    return (
      <Button className={className} onClick={onClick}>{children}</Button>
    )
  }
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
const Button = styled.button`
  background: transparent;
  border: 0;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  padding: 8px;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`

export const Icon = styled(IconEl)``
