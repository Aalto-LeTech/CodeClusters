import React, { memo } from 'react'
import styled from '../theme/styled'

interface IProps {
  className?: string
  options: string[]
  selected: string
  onSelect: (option: string) => void
}

const TabsMenuEl = memo((props: IProps) => {
  const { className, options, selected, onSelect } = props
  return (
    <Container className={className}>
      <TabList>
        { options.map(o =>
        <TabListItem key={o} selected={selected === o}>
          <TabButton onClick={() => onSelect(o)}>{o}</TabButton>
        </TabListItem>
        )}
      </TabList>
    </Container>
  )
})

const Container = styled.div`
`
const TabList = styled.ul`
  border-bottom: 1px solid ${({ theme }) => theme.color.gray.lighter};
  display: flex;
  list-style: none;
  margin: 0 15px;
  padding: 0;
`
const TabListItem = styled.li<{ selected: boolean }>`
  border-bottom: 2px solid ${({ selected, theme }) => selected ? theme.color.blue : 'transparent'};
  color: ${({ selected, theme }) => selected ? theme.color.textDark : theme.color.textLight};
  font-weight: ${({ selected }) => selected ? 'bold' : 400};
  margin-right: 15px;
  padding: 10px 0;
  &:hover {
    border-color: ${({ theme }) => theme.color.blue};
    color: ${({ theme }) => theme.color.textDark};
    font-weight: bold;
  }
`
const TabButton = styled.button`
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  text-transform: uppercase;
  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.gray.base};
    outline-style: dotted;
    outline-offset: 2px;
  }
`

export const TabsMenu = styled(TabsMenuEl)``
