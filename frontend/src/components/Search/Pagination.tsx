import React from 'react'
import styled from '../../theme/styled'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface IProps {
  className?: string
  pages: number
}

function PaginationEl(props: IProps) {
  const { className, pages } = props
  const shownPages = pages > 5 ? 5 : pages
  const selected = 2
  return (
    <Container className={`${className} ${pages === 0 && 'hidden'}`} >
      <IconWrapper><FiChevronLeft size={20}/></IconWrapper>
      <PageList>
        { Array(shownPages).fill(0).map((_, i) => <PageItem key={i} selected={i === selected}>{ i + 1}</PageItem>) }
      </PageList>
      <IconWrapper><FiChevronRight size={20}/></IconWrapper>
    </Container>
  )
}

const IconWrapper = styled.span`
  cursor: pointer;
  &:hover {
    background: #ededed;
  }
`
const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`
const PageList = styled.ol`
  align-items: center;
  display: flex;
`
const PageItem = styled.a<{ selected: boolean }>`
  border: 1px solid ${({ theme, selected }) => selected ? theme.color.primary : 'transparent'};
  border-radius: 0.1rem;
  color: #222;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  &:hover {
    background: #ededed;
  }
`

export const Pagination = styled(PaginationEl)``
