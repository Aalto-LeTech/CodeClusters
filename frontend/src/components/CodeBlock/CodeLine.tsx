import React, { memo } from 'react'
import styled from '../../theme/styled'

import { AsideSubmissionAddReviewForm } from '../Review/AsideSubmissionAddReviewForm'

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
        <AsideSubmissionAddReviewForm />
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
  & > ${AsideSubmissionAddReviewForm} {
    position: absolute;
    right: 0;
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
