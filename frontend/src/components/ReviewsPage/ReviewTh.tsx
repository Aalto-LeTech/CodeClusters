import React from 'react'
import styled from '../../theme/styled'

import { FloatingEditReviewMenu } from './FloatingEditReviewMenu'

import { IReview } from 'shared'

interface IProps {
  className?: string
  review: IReview
  active: boolean
  onClick: () => void
  closeEditReviewMenu: () => void
}

export const ReviewTh = styled((props: IProps) => {
  const { className, review, active, onClick, closeEditReviewMenu } = props
  return (
    <Th className={className} active={active} tabIndex={0} onClick={onClick}>
      {review.message.substring(0, 8)}...
      { active && <FloatingEditReviewMenu review={review} closeMenu={() => closeEditReviewMenu()}/>}
    </Th>
  )
})``

const Th = styled.th<{ active: boolean }>`
  background: ${({ active, theme }) => active && theme.color.green};
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  width: 75px;
  word-break: break-all;
  &:hover {
    background: ${({ active, theme }) => active ? theme.color.green : theme.color.gray.light};
  }
`
