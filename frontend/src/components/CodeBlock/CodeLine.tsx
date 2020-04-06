import React, { memo } from 'react'
import styled from '../../theme/styled'

import { FloatingReviewMenu } from '../FloatingReviewMenu'

interface IProps {
  className?: string
  code: string
  selected: boolean
  showMenu: boolean
  lineNumber: number
  onClick: (idx: number) => void
}

export const CodeLine = memo((props: IProps) => {
  const { className, code, selected, showMenu, lineNumber, onClick } = props

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()
    onClick(lineNumber)
  }
  return (
    <Wrapper className={className}>
      { showMenu &&
      <ReviewMenuWrapper>
        <FloatingReviewMenu />
      </ReviewMenuWrapper>}
      <Code
        active={showMenu}
        selected={selected}
        dangerouslySetInnerHTML={{ __html: code }}
        onClick={handleClick}
      />
    </Wrapper>
  )
})

const ReviewMenuWrapper = styled.div`
  position: relative;
  & > ${FloatingReviewMenu} {
    left: -300px;
    position: absolute;
    top: 0;
    width: 288px;
  }
`
const Wrapper = styled.div``
const Code = styled.div<{ active: boolean, selected: boolean }>`
  background: ${({ active, selected, theme }) => active ? '#bb4949' : selected ? '#666' : '#222'};
  cursor: pointer;
  &:hover {
    background: #bb4949;
  }
  & > mark {
    background: yellow;
  }
`
