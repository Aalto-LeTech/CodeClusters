import React from 'react'
import { observer } from 'mobx-react'
import styled from '../../theme/styled'

import { FloatingReviewMenu } from '../FloatingReviewMenu'

interface IProps {
  className?: string
  code: string
  active: boolean
  selected: boolean
  index: number
  onClick: (idx: number) => void
}

export const CodeLine = observer((props: IProps) => {
  const { className, code, active, selected, index, onClick } = props
  function handleClick() {
    onClick(index)
  }
  return (
    <Wrapper className={className}>
      { active &&
      <ReviewMenuWrapper>
        <FloatingReviewMenu />
      </ReviewMenuWrapper>}
      <Code
        active={active}
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
