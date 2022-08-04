import React from 'react'
import { inject, observer } from 'mobx-react'
import styled from '../../theme/styled'

import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi'

import { Icon } from '../../elements/Icon'

import { Stores } from '../../stores/Stores'

interface IProps {
  className?: string
  currentPage?: number
  searchResultsCount?: number
  numberOfShownResults?: number
  setSelectedPage?: (page: number) => void
}

const PaginationEl = inject((stores: Stores) => ({
  currentPage: stores.searchStore.currentPage,
  searchResultsCount: stores.searchStore.searchResultsCount,
  numberOfShownResults: stores.searchStore.numberOfShownResults,
  setSelectedPage: stores.searchStore.setSelectedPage,
}))
(observer((props: IProps) => {
  const { className, currentPage = 1, searchResultsCount = 0, numberOfShownResults = 20, setSelectedPage } = props
  const maxPages = Math.ceil((searchResultsCount + 1) / numberOfShownResults)
  const leftPages = currentPage - 5 > 1 ? currentPage - 4 : 1
  const leftDots = currentPage - 5 > 1
  const rightPages = currentPage + 5 < maxPages ? currentPage + 4 : maxPages
  const rightDots = currentPage + 5 < maxPages
  const pages = rightPages - leftPages + 1
  const isHidden = searchResultsCount === 0 || maxPages === 1

  function handleClickIcon(direction: 'left' | 'right') {
    if (direction === 'left' && currentPage !== 1) {
      setSelectedPage!(currentPage - 1)
    } else if (direction === 'right' && currentPage !== maxPages) {
      setSelectedPage!(currentPage + 1)
    }
  }
  function handleClickPage(page: number) {
    setSelectedPage!(page)
  }
  return (
    <Container className={`${className} ${isHidden && 'hidden'}`} >
      <Icon button onClick={() => handleClickIcon('left')}><FiChevronLeft size={20}/></Icon>
      <PageList>
        { leftDots &&
          <PageItem><PageButton selected={false} onClick={() => handleClickPage(1)}>
          {1}
          </PageButton></PageItem>
        }
        { leftDots && <Icon><FiMoreHorizontal size={20}/></Icon>}
        { Array(pages).fill(0).map((_, i) =>
        <PageItem key={i}>
          <PageButton selected={(leftPages + i) === currentPage} onClick={() => handleClickPage(leftPages + i)}>
            { leftPages + i}
          </PageButton>
        </PageItem>
        )}
        { rightDots && <Icon><FiMoreHorizontal size={20}/></Icon>}
        { rightDots &&
          <PageItem><PageButton selected={false} onClick={() => handleClickPage(maxPages)}>
          {maxPages}
          </PageButton></PageItem>
        }
      </PageList>
      <Icon button onClick={() => handleClickIcon('right')}><FiChevronRight size={20}/></Icon>
    </Container>
  )
}))

const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  &.hidden {
    display: none;
    visibility: hidden;
  }
`
const PageList = styled.ol`
  align-items: center;
  display: flex;
  margin: 0 8px;
  & > * + * {
    margin-left: 8px;
  }
`
const PageItem = styled.li`
`
const PageButton = styled.button<{ selected: boolean }>`
  background: ${({ theme, selected }) => selected ? theme.color.primary : '#fff'};
  border: 0;
  border-radius: 2px;
  color: #222;
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  padding: 0.5rem;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:hover {
    background: ${({ theme, selected }) => selected ? theme.color.primary : '#bbb'};
  }
`

export const Pagination = styled(PaginationEl)``
