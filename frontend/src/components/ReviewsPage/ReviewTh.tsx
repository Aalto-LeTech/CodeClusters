import React from 'react'
import styled from '../../theme/styled'

import { IReview } from 'shared'

interface IProps {
  className?: string
  review: IReview
  onClick: () => void
}

export const ReviewTh = styled((props: IProps) => {
  const { className, review, onClick } = props
  return (
    <Th className={className} tabIndex={0} onClick={onClick}>
      {review.message.substring(0, 8)}...
    </Th>
  )
})``

const Th = styled.th`
  border-radius: 2px;
  cursor: pointer;
  font-size: 0.8rem;
  height: 30px;
  position: relative;
  width: 75px;
  word-break: break-all;
  &:hover {
    background: ${({ theme }) => theme.color.primaryLight};
  }
`
