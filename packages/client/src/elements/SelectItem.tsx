import React, { memo } from 'react'
import styled from '../theme/styled'

import { MdKeyboardArrowUp } from 'react-icons/md'

interface IProps {
  className?: string
  currentItemIdx: number
  itemsCount: number
  onAddItem?: () => void
  onSelectItem: (idx: number) => void
}

const SelectItemEl = memo((props: IProps) => {
  const { className, currentItemIdx, itemsCount, onAddItem, onSelectItem } = props
  const items = Array(itemsCount).fill(0)
  return (
    <MoreReviewsList className={className}>
      {items.map((item, i) => (
        <MoreReviewItem key={i} selected={i === currentItemIdx}>
          <MoreReviewButton
            type="button"
            selected={i === currentItemIdx}
            onClick={() => onSelectItem(i)}
          >
            {i + 1}
          </MoreReviewButton>
          <ReviewSelectedIcon className={i === currentItemIdx ? '' : 'hidden'}>
            <MdKeyboardArrowUp size={24} />
          </ReviewSelectedIcon>
        </MoreReviewItem>
      ))}
      {onAddItem && (
        <div>
          <AddReviewButton type="button" onClick={onAddItem}>
            New
          </AddReviewButton>
        </div>
      )}
    </MoreReviewsList>
  )
})

const MoreReviewsList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
`
const MoreReviewItem = styled.li<{ selected: boolean }>`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 1rem;
`
const MoreReviewButton = styled.button<{ selected: boolean }>`
  border: 0;
  border-radius: 0.1rem;
  color: #222;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  &:hover {
    background: #ededed;
  }
`
const AddReviewButton = styled.button`
  background: ${({ theme }) => theme.color.primary};
  border: 0;
  border-radius: 0.1rem;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  &:hover {
    background: ${({ theme }) => theme.color.secondary};
  }
`
const ReviewSelectedIcon = styled.span`
  margin-top: -4px;
  &.hidden {
    visibility: hidden;
  }
`

export const SelectItem = styled(SelectItemEl)``
